import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { first, map, switchMap, take } from 'rxjs/operators';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { LinkService } from '../../cache/builders/link.service';
import { PaginatedList } from '../../data/paginated-list.model';
import { ResponseParsingService } from '../../data/parsing.service';
import { RemoteData } from '../../data/remote-data';
import { GetRequest, RestRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { DSpaceObject } from '../dspace-object.model';
import { GenericConstructor } from '../generic-constructor';
import { HALEndpointService } from '../hal-endpoint.service';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { hasValue, isEmpty, isNotEmpty, hasValueOperator } from '../../../shared/empty.util';
import { SearchOptions } from '../../../shared/search/search-options.model';
import { SearchFilterConfig } from '../../../shared/search/search-filter-config.model';
import { SearchResponseParsingService } from '../../data/search-response-parsing.service';
import { SearchObjects } from '../../../shared/search/search-objects.model';
import { FacetValueResponseParsingService } from '../../data/facet-value-response-parsing.service';
import { FacetConfigResponseParsingService } from '../../data/facet-config-response-parsing.service';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { Community } from '../community.model';
import { CommunityDataService } from '../../data/community-data.service';
import { ViewMode } from '../view-mode.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import {
  getFirstSucceededRemoteData,
  getFirstCompletedRemoteData,
  getRemoteDataPayload
} from '../operators';
import { RouteService } from '../../services/route.service';
import { SearchConfigResponseParsingService } from '../../data/search-config-response-parsing.service';
import { SearchConfig } from '../../../shared/search/search-filters/search-config.model';
import { SearchResult } from '../../../shared/search/search-result.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { getSearchResultFor } from '../../../shared/search/search-result-element-decorator';
import { FacetConfigResponse } from '../../../shared/search/facet-config-response.model';
import { FacetValues } from '../../../shared/search/facet-values.model';

/**
 * Service that performs all general actions that have to do with the search page
 */
@Injectable()
export class SearchService implements OnDestroy {

  /**
   * Endpoint link path for retrieving search configurations
   */
  private configurationLinkPath = 'discover/search';

  /**
   * Endpoint link path for retrieving general search results
   */
  private searchLinkPath = 'discover/search/objects';

  /**
   * Endpoint link path for retrieving facet config incl values
   */
  private facetLinkPathPrefix = 'discover/facets/';

  /**
   * Endpoint link path for retrieving configured facets with their respective values
   */
  private searchFacetLinkPath = 'discover/search/facets/';

  /**
   * The ResponseParsingService constructor name
   */
  private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;

  /**
   * The RestRequest constructor name
   */
  private request: GenericConstructor<RestRequest> = GetRequest;

  /**
   * Subscription to unsubscribe from
   */
  private sub;

  constructor(private router: Router,
              private routeService: RouteService,
              protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private linkService: LinkService,
              private halService: HALEndpointService,
              private communityService: CommunityDataService,
              private dspaceObjectService: DSpaceObjectDataService
  ) {
  }

  /**
   * Method to set service options
   * @param {GenericConstructor<ResponseParsingService>} parser The ResponseParsingService constructor name
   * @param {boolean} request The RestRequest constructor name
   */
  setServiceOptions(parser: GenericConstructor<ResponseParsingService>, request: GenericConstructor<RestRequest>) {
    if (parser) {
      this.parser = parser;
    }
    if (request) {
      this.request = request;
    }
  }

  getEndpoint(searchOptions?: PaginatedSearchOptions): Observable<string> {
    return this.halService.getEndpoint(this.searchLinkPath).pipe(
      map((url: string) => {
        if (hasValue(searchOptions)) {
          return (searchOptions as PaginatedSearchOptions).toRestUrl(url);
        } else {
          return url;
        }
      })
    );
  }

  /**
   * Method to retrieve a paginated list of search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @param responseMsToLive The amount of milliseconds for the response to live in cache
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
   */
  search<T extends DSpaceObject>(searchOptions?: PaginatedSearchOptions, responseMsToLive?: number, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
    const href$ = this.getEndpoint(searchOptions);

    href$.pipe(take(1)).subscribe((url: string) => {
      const request = new this.request(this.requestService.generateRequestId(), url);

      const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
        return this.parser;
      };

      Object.assign(request, {
        responseMsToLive: hasValue(responseMsToLive) ? responseMsToLive : request.responseMsToLive,
        getResponseParser: getResponseParserFn,
        searchOptions: searchOptions
      });

      this.requestService.configure(request);
    });

    const sqr$ = href$.pipe(
      switchMap((href: string) => this.rdb.buildFromHref<SearchObjects<T>>(href))
    );

    return this.directlyAttachIndexableObjects(sqr$);
 }

  /**
   * Method to retrieve request entries for search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
   */
  searchEntries<T extends DSpaceObject>(searchOptions?: PaginatedSearchOptions): Observable<RemoteData<SearchObjects<T>>> {
    const href$ = this.getEndpoint(searchOptions);

    const sqr$ = href$.pipe(
      switchMap((href: string) => this.rdb.buildFromHref<SearchObjects<T>>(href))
    );

    return this.directlyAttachIndexableObjects(sqr$);
  }

  /**
   * Method to directly attach the indexableObjects to search results, instead of using RemoteData.
   * For compatibility with the way the search was written originally
   *
   * @param sqr$:         a SearchObjects RemotaData Observable without its indexableObjects
   *                      attached
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s on
   *                      the indexableObjects should be automatically resolved
   * @protected
   */
  protected directlyAttachIndexableObjects<T extends DSpaceObject>(sqr$: Observable<RemoteData<SearchObjects<T>>>, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
    return sqr$.pipe(
      switchMap((resultsRd: RemoteData<SearchObjects<T>>) => {
        if (hasValue(resultsRd.payload) && isNotEmpty(resultsRd.payload.page)) {
          // retrieve the indexableObjects for all search results on the page
          const searchResult$Array: Observable<SearchResult<T>>[] = resultsRd.payload.page.map((result: SearchResult<T>) =>
            this.dspaceObjectService.findByHref(result._links.indexableObject.href, true, ...linksToFollow as any).pipe(
              getFirstCompletedRemoteData(),
              getRemoteDataPayload(),
              hasValueOperator(),
              map((indexableObject: DSpaceObject) => {
                // determine the constructor of the search result (ItemSearchResult,
                // CollectionSearchResult, etc) based on the kind of the indeaxbleObject it
                // contains. Recreate the result with that constructor
                const constructor: GenericConstructor<ListableObject> = indexableObject.constructor as GenericConstructor<ListableObject>;
                const resultConstructor = getSearchResultFor(constructor);

                // Attach the payload directly to the indexableObject property on the result
                return Object.assign(new resultConstructor(), result, {
                  indexableObject
                }) as SearchResult<T>;
              }),
            )
          );

          // Swap the original page in the remoteData with the new one, now that the results have the
          // correct types, and all indexableObjects are directly attached.
          return observableCombineLatest(searchResult$Array).pipe(
            map((page: SearchResult<T>[]) => {

              const payload = Object.assign(new SearchObjects(), resultsRd.payload, {
                page
              }) as SearchObjects<T>;

              return new RemoteData(
                resultsRd.timeCompleted,
                resultsRd.msToLive,
                resultsRd.lastUpdated,
                resultsRd.state,
                resultsRd.errorMessage,
                payload,
                resultsRd.statusCode,
              );
            })
          );
        }
        // If we don't have a payload, or the page is empty, simply pass on the unmodified
        // RemoteData object
        return [resultsRd];
      })
    );
  }

  /**
   * Request the filter configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  getConfig(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    return this.getFilterConfigByLink(this.facetLinkPathPrefix, scope, configurationName);
  }

  /**
   * Request the filter configuration for a given scope or the whole repository by a link name
   * @param {link}   link the link to use for the request
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  private getFilterConfigByLink(link: string, scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    const href$ = this.halService.getEndpoint(link).pipe(
      map((url: string) => {
        const args: string[] = [];

        if (isNotEmpty(scope)) {
          args.push(`scope=${scope}`);
        }

        if (isNotEmpty(configurationName)) {
          args.push(`configuration=${configurationName}`);
        }

        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }

        return url;
      }),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      let request = new this.request(this.requestService.generateRequestId(), url);
      request = Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return FacetConfigResponseParsingService;
        }
      });
      this.requestService.configure(request);
    });

    return this.rdb.buildFromHref(href$).pipe(
      map((rd: RemoteData<FacetConfigResponse>) => {
        if (rd.hasSucceeded) {
          return new RemoteData(
            rd.timeCompleted,
            rd.msToLive,
            rd.lastUpdated,
            rd.state,
            rd.errorMessage,
            rd.payload.filters,
            rd.statusCode,
          );
        } else {
          return rd as any as RemoteData<SearchFilterConfig[]>;
        }
      })
    );
  }
  /**
   * Method to request a single page of filter values for a given value
   * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
   * @param {number} valuePage The page number of the filter values
   * @param {SearchOptions} searchOptions The search configuration for the current search
   * @param {string} filterQuery The optional query used to filter out filter values
   * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
   */
  getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: SearchOptions, filterQuery?: string): Observable<RemoteData<FacetValues>> {
    let href;
    const args: string[] = [`page=${valuePage - 1}`, `size=${filterConfig.pageSize}`];
    if (hasValue(filterQuery)) {
      args.push(`prefix=${filterQuery}`);
    }
    if (hasValue(searchOptions)) {
      href = searchOptions.toRestUrl(filterConfig._links.self.href, args);
    } else {
      href = new URLCombiner(filterConfig._links.self.href, `?${args.join('&')}`).toString();
    }

    let request = new this.request(this.requestService.generateRequestId(), href);
    request = Object.assign(request, {
      getResponseParser(): GenericConstructor<ResponseParsingService> {
        return FacetValueResponseParsingService;
      }
    });
    this.requestService.configure(request);

    return this.rdb.buildFromHref(href);
  }

  /**
   * Request the filter configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  searchFacets(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    return this.getFilterConfigByLink(this.searchFacetLinkPath, scope, configurationName);
  }

  /**
   * Request a list of DSpaceObjects that can be used as a scope, based on the current scope
   * @param {string} scopeId UUID of the current scope, if the scope is empty, the repository wide scopes will be returned
   * @returns {Observable<DSpaceObject[]>} Emits a list of DSpaceObjects which represent possible scopes
   */
  getScopes(scopeId?: string): Observable<DSpaceObject[]> {

    if (isEmpty(scopeId)) {
      const top: Observable<Community[]> = this.communityService.findTop({ elementsPerPage: 9999 }).pipe(
        getFirstSucceededRemoteData(),
        map(
          (communities: RemoteData<PaginatedList<Community>>) => communities.payload.page
        )
      );
      return top;
    }

    const scopeObject: Observable<RemoteData<DSpaceObject>> = this.dspaceObjectService.findById(scopeId).pipe(getFirstSucceededRemoteData());
    const scopeList: Observable<DSpaceObject[]> = scopeObject.pipe(
      switchMap((dsoRD: RemoteData<DSpaceObject>) => {
          if ((dsoRD.payload as any).type === Community.type.value) {
            const community: Community = dsoRD.payload as Community;
            this.linkService.resolveLinks(community, followLink('subcommunities'), followLink('collections'));
            return observableCombineLatest([
              community.subcommunities.pipe(getFirstCompletedRemoteData()),
              community.collections.pipe(getFirstCompletedRemoteData())
            ]).pipe(
              map(([subCommunities, collections]) => {
                /*if this is a community, we also need to show the direct children*/
                return [community, ...subCommunities.payload.page, ...collections.payload.page];
              })
            );
          } else {
            return observableOf([dsoRD.payload]);
          }
        }
      ));

    return scopeList;

  }

  /**
   * Requests the current view mode based on the current URL
   * @returns {Observable<ViewMode>} The current view mode
   */
  getViewMode(): Observable<ViewMode> {
    return this.routeService.getQueryParamMap().pipe(map((params) => {
      if (isNotEmpty(params.get('view')) && hasValue(params.get('view'))) {
        return params.get('view');
      } else {
        return ViewMode.ListElement;
      }
    }));
  }

  /**
   * Changes the current view mode in the current URL
   * @param {ViewMode} viewMode Mode to switch to
   */
  setViewMode(viewMode: ViewMode, searchLinkParts?: string[]) {
    this.routeService.getQueryParameterValue('pageSize').pipe(first())
      .subscribe((pageSize) => {
        let queryParams = { view: viewMode, page: 1 };
        if (viewMode === ViewMode.DetailedListElement) {
          queryParams = Object.assign(queryParams, {pageSize: '1'});
        } else if (pageSize === '1') {
          queryParams = Object.assign(queryParams, {pageSize: '10'});
        }
        const navigationExtras: NavigationExtras = {
          queryParams: queryParams,
          queryParamsHandling: 'merge'
        };

        this.router.navigate(hasValue(searchLinkParts) ? searchLinkParts : [this.getSearchLink()], navigationExtras);
      });
  }

  /**
   * Request the search configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchConfig[]>>} The found configuration
   */
  getSearchConfigurationFor(scope?: string, configurationName?: string ): Observable<RemoteData<SearchConfig>> {
    const href$ = this.halService.getEndpoint(this.configurationLinkPath).pipe(
      map((url: string) => {
        const args: string[] = [];

        if (isNotEmpty(scope)) {
          args.push(`scope=${scope}`);
        }

        if (isNotEmpty(configurationName)) {
          args.push(`configuration=${configurationName}`);
        }

        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }

        return url;
      }),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      let request = new this.request(this.requestService.generateRequestId(), url);
      request = Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return SearchConfigResponseParsingService;
        }
      });
      this.requestService.configure(request);
    });

    return this.rdb.buildFromHref(href$);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink(): string {
    return '/search';
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}

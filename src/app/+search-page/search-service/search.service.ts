import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  PRIMARY_OUTLET,
  Router,
  UrlSegmentGroup
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { flatMap, map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import {
  FacetConfigSuccessResponse,
  FacetValueSuccessResponse,
  SearchSuccessResponse
} from '../../core/cache/response-cache.models';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { ResponseParsingService } from '../../core/data/parsing.service';
import { RemoteData } from '../../core/data/remote-data';
import { GetRequest, RestRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { configureRequest } from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { NormalizedSearchResult } from '../normalized-search-result.model';
import { SearchOptions } from '../search-options.model';
import { SearchResult } from '../search-result.model';
import { FacetValue } from './facet-value.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchResponseParsingService } from '../../core/data/search-response-parsing.service';
import { SearchQueryResponse } from './search-query-response.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { getSearchResultFor } from './search-result-element-decorator';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { FacetValueResponseParsingService } from '../../core/data/facet-value-response-parsing.service';
import { FacetConfigResponseParsingService } from '../../core/data/facet-config-response-parsing.service';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { PIDService } from '../../core/data/pid.service';
import { ResourceType } from '../../core/shared/resource-type';

/**
 * Service that performs all general actions that have to do with the search page
 */
@Injectable()
export class SearchService implements OnDestroy {
  /**
   * Endpoint link path for retrieving general search results
   */
  private searchLinkPath = 'discover/search/objects';

  /**
   * Endpoint link path for retrieving facet config incl values
   */
  private facetLinkPathPrefix = 'discover/facets/';

  /**
   * Subscription to unsubscribe from
   */
  private sub;

  constructor(private router: Router,
              private route: ActivatedRoute,
              protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private halService: HALEndpointService,
              private communityService: CommunityDataService,
              private pidService: PIDService
  ) {
  }

  /**
   * Method to retrieve a paginated list of search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @returns {Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>} Emits a paginated list with all search results found
   */
  search(searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const requestObs = this.halService.getEndpoint(this.searchLinkPath).pipe(
      map((url: string) => {
        if (hasValue(searchOptions)) {
          url = (searchOptions as PaginatedSearchOptions).toRestUrl(url);
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return SearchResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    );
    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const sqrObs: Observable<SearchQueryResponse> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: SearchSuccessResponse) => response.results)
    );

    // turn dspace href from search results to effective list of DSpaceObjects
    // Turn list of observable remote data DSO's into observable remote data object with list of DSO
    const dsoObs: Observable<RemoteData<DSpaceObject[]>> = sqrObs.pipe(
      map((sqr: SearchQueryResponse) => {
        return sqr.objects.map((nsr: NormalizedSearchResult) =>
          this.rdb.buildSingle(nsr.dspaceObject));
      }),
      flatMap((input: Array<Observable<RemoteData<DSpaceObject>>>) => this.rdb.aggregate(input))
    );

    // Create search results again with the correct dso objects linked to each result
    const tDomainListObs = Observable.combineLatest(sqrObs, dsoObs, (sqr: SearchQueryResponse, dsos: RemoteData<DSpaceObject[]>) => {

      return sqr.objects.map((object: NormalizedSearchResult, index: number) => {
        let co = DSpaceObject;
        if (dsos.payload[index]) {
          const constructor: GenericConstructor<ListableObject> = dsos.payload[index].constructor as GenericConstructor<ListableObject>;
          co = getSearchResultFor(constructor);
          return Object.assign(new co(), object, {
            dspaceObject: dsos.payload[index]
          });
        } else {
          return undefined;
        }
      });
    });

    const pageInfoObs: Observable<PageInfo> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = Observable.combineLatest(tDomainListObs, pageInfoObs, (tDomainList, pageInfo) => {
      return new PaginatedList(pageInfo, tDomainList);
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  /**
   * Request the filter configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  getConfig(scope?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    const requestObs = this.halService.getEndpoint(this.facetLinkPathPrefix).pipe(
      map((url: string) => {
        const args: string[] = [];

        if (isNotEmpty(scope)) {
          args.push(`scope=${scope}`);
        }

        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }

        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetConfigResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const facetConfigObs: Observable<SearchFilterConfig[]> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetConfigSuccessResponse) =>
        response.results.map((result: any) => Object.assign(new SearchFilterConfig(), result)))
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, facetConfigObs);
  }

  /**
   * Method to request a single page of filter values for a given value
   * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
   * @param {number} valuePage The page number of the filter values
   * @param {SearchOptions} searchOptions The search configuration for the current search
   * @param {string} filterQuery The optional query used to filter out filter values
   * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
   */
  getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: SearchOptions, filterQuery?: string): Observable<RemoteData<PaginatedList<FacetValue>>> {
    const requestObs = this.halService.getEndpoint(this.facetLinkPathPrefix + filterConfig.name).pipe(
      map((url: string) => {
        const args: string[] = [`page=${valuePage - 1}`, `size=${filterConfig.pageSize}`];
        if (hasValue(filterQuery)) {
          args.push(`prefix=${filterQuery}`);
        }
        if (hasValue(searchOptions)) {
          url = searchOptions.toRestUrl(url, args);
        }

        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetValueResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const facetValueObs: Observable<FacetValue[]> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.results)
    );

    const pageInfoObs: Observable<PageInfo> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = Observable.combineLatest(facetValueObs, pageInfoObs, (facetValue, pageInfo) => {
      return new PaginatedList(pageInfo, facetValue);
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  /**
   * Request a list of DSpaceObjects that can be used as a scope, based on the current scope
   * @param {string} scopeId UUID of the current scope, if the scope is empty, the repository wide scopes will be returned
   * @returns {Observable<DSpaceObject[]>} Emits a list of DSpaceObjects which represent possible scopes
   */
  getScopes(scopeId?: string): Observable<DSpaceObject[]> {

    if (isEmpty(scopeId)) {
      const top: Observable<Community[]> = this.communityService.findTop({ elementsPerPage: 9999 }).pipe(
        map(
          (communities: RemoteData<PaginatedList<Community>>) => communities.payload.page
        )
      );
      return top;
    }

    const scopeObject: Observable<RemoteData<DSpaceObject>> = this.pidService.findById(scopeId).filter((dsoRD: RemoteData<DSpaceObject>) => !dsoRD.isLoading);
    const scopeList: Observable<DSpaceObject[]> = scopeObject.pipe(
      flatMap((dsoRD: RemoteData<DSpaceObject>) => {
          if (dsoRD.payload.type === ResourceType.Community) {
            const community: Community = dsoRD.payload as Community;
            return Observable.combineLatest(community.subcommunities, community.collections, (subCommunities, collections) => {
              /*if this is a community, we also need to show the direct children*/
              return [community, ...subCommunities.payload.page, ...collections.payload.page]
            })
          } else {
            return Observable.of([dsoRD.payload]);
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
    return this.route.queryParams.map((params) => {
      if (isNotEmpty(params.view) && hasValue(params.view)) {
        return params.view;
      } else {
        return ViewMode.List;
      }
    });
  }

  /**
   * Changes the current view mode in the current URL
   * @param {ViewMode} viewMode Mode to switch to
   */
  setViewMode(viewMode: ViewMode) {
    const navigationExtras: NavigationExtras = {
      queryParams: { view: viewMode },
      queryParamsHandling: 'merge'
    };

    this.router.navigate([this.getSearchLink()], navigationExtras);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
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

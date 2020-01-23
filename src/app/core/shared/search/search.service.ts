import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { FacetConfigSuccessResponse, FacetValueSuccessResponse, SearchSuccessResponse } from '../../cache/response.models';
import { PaginatedList } from '../../data/paginated-list';
import { ResponseParsingService } from '../../data/parsing.service';
import { RemoteData } from '../../data/remote-data';
import { GetRequest, RestRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { DSpaceObject } from '../dspace-object.model';
import { GenericConstructor } from '../generic-constructor';
import { HALEndpointService } from '../hal-endpoint.service';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { NormalizedSearchResult } from '../../../shared/search/normalized-search-result.model';
import { SearchOptions } from '../../../shared/search/search-options.model';
import { SearchResult } from '../../../shared/search/search-result.model';
import { FacetValue } from '../../../shared/search/facet-value.model';
import { SearchFilterConfig } from '../../../shared/search/search-filter-config.model';
import { SearchResponseParsingService } from '../../data/search-response-parsing.service';
import { SearchQueryResponse } from '../../../shared/search/search-query-response.model';
import { PageInfo } from '../page-info.model';
import { getSearchResultFor } from '../../../shared/search/search-result-element-decorator';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { FacetValueResponseParsingService } from '../../data/facet-value-response-parsing.service';
import { FacetConfigResponseParsingService } from '../../data/facet-config-response-parsing.service';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { Community } from '../community.model';
import { CommunityDataService } from '../../data/community-data.service';
import { ViewMode } from '../view-mode.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { configureRequest, filterSuccessfulResponses, getResponseFromEntry, getSucceededRemoteData } from '../operators';
import { RouteService } from '../../services/route.service';
import { RequestEntry } from '../../data/request.reducer';

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
   * @returns {Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>} Emits a paginated list with all search results found
   */
  search(searchOptions?: PaginatedSearchOptions, responseMsToLive?: number): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    return this.getPaginatedResults(this.searchEntries(searchOptions));
  }

  /**
   * Method to retrieve request entries for search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @param responseMsToLive The amount of milliseconds for the response to live in cache
   * @returns {Observable<RequestEntry>} Emits an observable with the request entries
   */
  searchEntries(searchOptions?: PaginatedSearchOptions, responseMsToLive?: number): Observable<{searchOptions: PaginatedSearchOptions, requestEntry: RequestEntry}> {

    const hrefObs = this.getEndpoint(searchOptions);

    const requestObs = hrefObs.pipe(
      map((url: string) => {
        const request = new this.request(this.requestService.generateRequestId(), url);

        const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
          return this.parser;
        };

        return Object.assign(request, {
          responseMsToLive: hasValue(responseMsToLive) ? responseMsToLive : request.responseMsToLive,
          getResponseParser: getResponseParserFn,
          searchOptions: searchOptions
        });
      }),
      configureRequest(this.requestService),
    );
    return requestObs.pipe(
      switchMap((request: RestRequest) => this.requestService.getByHref(request.href)),
      map(((requestEntry: RequestEntry) => ({
        searchOptions: searchOptions,
        requestEntry: requestEntry
      })))
    );
  }

  /**
   * Method to convert the parsed responses into a paginated list of search results
   * @param searchEntries: The request entries from the search method
   * @returns {Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>} Emits a paginated list with all search results found
   */
  getPaginatedResults(searchEntries: Observable<{ searchOptions: PaginatedSearchOptions, requestEntry: RequestEntry }>): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const requestEntryObs: Observable<RequestEntry> = searchEntries.pipe(
      map((entry) => entry.requestEntry),
    );

    // get search results from response cache
    const sqrObs: Observable<SearchQueryResponse> = requestEntryObs.pipe(
      filterSuccessfulResponses(),
      map((response: SearchSuccessResponse) => response.results),
    );

    // turn dspace href from search results to effective list of DSpaceObjects
    // Turn list of observable remote data DSO's into observable remote data object with list of DSO
    const dsoObs: Observable<RemoteData<DSpaceObject[]>> = sqrObs.pipe(
      map((sqr: SearchQueryResponse) => {
        return sqr.objects
          .filter((nsr: NormalizedSearchResult) => isNotUndefined(nsr.indexableObject))
          .map((nsr: NormalizedSearchResult) => new GetRequest(this.requestService.generateRequestId(), nsr.indexableObject))
      }),
      // Send a request for each item to ensure fresh cache
      tap((reqs: RestRequest[]) => reqs.forEach((req: RestRequest) => this.requestService.configure(req))),
      map((reqs: RestRequest[]) => reqs.map((req: RestRequest) => this.rdb.buildSingle(req.href))),
      switchMap((input: Array<Observable<RemoteData<DSpaceObject>>>) => this.rdb.aggregate(input)),
    );

    // Create search results again with the correct dso objects linked to each result
    const tDomainListObs = observableCombineLatest(sqrObs, dsoObs).pipe(
      map(([sqr, dsos]) => {
        return sqr.objects.map((object: NormalizedSearchResult, index: number) => {
          let co = DSpaceObject;
          if (dsos.payload[index]) {
            const constructor: GenericConstructor<ListableObject> = dsos.payload[index].constructor as GenericConstructor<ListableObject>;
            co = getSearchResultFor(constructor);
            return Object.assign(new co(), object, {
              indexableObject: dsos.payload[index]
            });
          } else {
            return undefined;
          }
        });
      })
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(tDomainListObs, pageInfoObs).pipe(
      map(([tDomainList, pageInfo]) => {
        return new PaginatedList(pageInfo, tDomainList.filter((obj) => hasValue(obj)));
      })
    );

    return observableCombineLatest(tDomainListObs, searchEntries).pipe(
      switchMap(([tDomainList, searchEntry]) => {
        const requestEntry = searchEntry.requestEntry;
        if (tDomainList.indexOf(undefined) > -1 && requestEntry && requestEntry.completed) {
          this.requestService.removeByHrefSubstring(requestEntry.request.href);
          return this.search(searchEntry.searchOptions)
        } else {
          return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
        }
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
    const requestObs = this.halService.getEndpoint(this.facetLinkPathPrefix).pipe(
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

        const request = new this.request(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetConfigResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    );

    const requestEntryObs = requestObs.pipe(
      switchMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    // get search results from response cache
    const facetConfigObs: Observable<SearchFilterConfig[]> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: FacetConfigSuccessResponse) =>
        response.results.map((result: any) => Object.assign(new SearchFilterConfig(), result)))
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, facetConfigObs);
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

        const request = new this.request(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetValueResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService),
      first()
    );

    const requestEntryObs = requestObs.pipe(
      switchMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    // get search results from response cache
    const facetValueObs: Observable<FacetValue[]> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: FacetValueSuccessResponse) => response.results)
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(facetValueObs, pageInfoObs).pipe(
      map(([facetValue, pageInfo]) => {
        return new PaginatedList(pageInfo, facetValue);
      })
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
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

    const scopeObject: Observable<RemoteData<DSpaceObject>> = this.dspaceObjectService.findById(scopeId).pipe(getSucceededRemoteData());
    const scopeList: Observable<DSpaceObject[]> = scopeObject.pipe(
      switchMap((dsoRD: RemoteData<DSpaceObject>) => {
          if ((dsoRD.payload as any).type === Community.type.value) {
            const community: Community = dsoRD.payload as Community;
            return observableCombineLatest(community.subcommunities, community.collections).pipe(
              map(([subCommunities, collections]) => {
                /*if this is a community, we also need to show the direct children*/
                return [community, ...subCommunities.payload.page, ...collections.payload.page]
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
      })
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

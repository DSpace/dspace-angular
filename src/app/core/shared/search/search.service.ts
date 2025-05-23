/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  skipWhile,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import {
  hasValue,
  hasValueOperator,
  isNotEmpty,
} from '../../../shared/empty.util';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { AppliedFilter } from '../../../shared/search/models/applied-filter.model';
import { FacetValues } from '../../../shared/search/models/facet-values.model';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchObjects } from '../../../shared/search/models/search-objects.model';
import { SearchResult } from '../../../shared/search/models/search-result.model';
import { getSearchResultFor } from '../../../shared/search/search-result-element-decorator';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { BaseDataService } from '../../data/base/base-data.service';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { FacetValueResponseParsingService } from '../../data/facet-value-response-parsing.service';
import { ResponseParsingService } from '../../data/parsing.service';
import { RemoteData } from '../../data/remote-data';
import { GetRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { RestRequest } from '../../data/rest-request.model';
import { SearchResponseParsingService } from '../../data/search-response-parsing.service';
import { PaginationService } from '../../pagination/pagination.service';
import { RouteService } from '../../services/route.service';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { DSpaceObject } from '../dspace-object.model';
import { GenericConstructor } from '../generic-constructor';
import { HALEndpointService } from '../hal-endpoint.service';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../operators';
import { ViewMode } from '../view-mode.model';
import { SearchConfigurationService } from './search-configuration.service';

/**
 * A limited data service implementation for the 'discover' endpoint
 * - Overrides {@link BaseDataService.addEmbedParams} in order to make it public
 *
 * Doesn't use any of the service's dependencies, they are initialized as undefined
 * Therefore, request/response handling methods won't work even though they're defined
 */
class SearchDataService extends BaseDataService<any> {
  constructor() {
    super('discover', undefined, undefined, undefined, undefined);
  }

  /**
   * Adds the embed options to the link for the request
   * @param href            The href the params are to be added to
   * @param args            params for the query string
   * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
   */
  public addEmbedParams(href: string, args: string[], ...linksToFollow: FollowLinkConfig<any>[]) {
    return super.addEmbedParams(href, args, ...linksToFollow);
  }
}

/**
 * Service that performs all general actions that have to do with the search page
 */
@Injectable({ providedIn: 'root' })
export class SearchService {

  /**
   * Endpoint link path for retrieving general search results
   */
  private searchLinkPath = 'discover/search/objects';

  /**
   * The ResponseParsingService constructor name
   */
  private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;

  /**
   * The RestRequest constructor name
   */
  private request: GenericConstructor<RestRequest> = GetRequest;

  /**
   * Instance of SearchDataService to forward data service methods to
   */
  private searchDataService: SearchDataService;

  public appliedFilters$: BehaviorSubject<AppliedFilter[]> = new BehaviorSubject([]);

  constructor(
    private routeService: RouteService,
    protected requestService: RequestService,
    private rdb: RemoteDataBuildService,
    private halService: HALEndpointService,
    private dspaceObjectService: DSpaceObjectDataService,
    private paginationService: PaginationService,
    private searchConfigurationService: SearchConfigurationService,
    private angulartics2: Angulartics2,
  ) {
    this.searchDataService = new SearchDataService();
  }

  /**
   * Get the currently {@link AppliedFilter}s for the given filter.
   *
   * @param filterName The name of the filter
   */
  getSelectedValuesForFilter(filterName: string): Observable<AppliedFilter[]> {
    return this.appliedFilters$.pipe(
      map((appliedFilters: AppliedFilter[]) => appliedFilters.filter((appliedFilter: AppliedFilter) => appliedFilter.filter === filterName)),
      distinctUntilChanged((previous: AppliedFilter[], next: AppliedFilter[]) => JSON.stringify(previous) === JSON.stringify(next)),
    );
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
      }),
    );
  }

  /**
   * Method to retrieve a paginated list of search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @param responseMsToLive The amount of milliseconds for the response to live in cache
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   * no valid cached version. Defaults to true
   * @param reRequestOnStale Whether or not the request should automatically be re-requested after
   * the response becomes stale
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
   */
  search<T extends DSpaceObject>(searchOptions?: PaginatedSearchOptions, responseMsToLive?: number, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
    const href$ = this.getEndpoint(searchOptions);

    let startTime: number;
    href$.pipe(
      take(1),
      map((href: string) => {
        const args = this.searchDataService.addEmbedParams(href, [], ...linksToFollow);
        if (isNotEmpty(args)) {
          return new URLCombiner(href, `?${args.join('&')}`).toString();
        } else {
          return href;
        }
      }),
    ).subscribe((url: string) => {
      const request = new this.request(this.requestService.generateRequestId(), url);

      const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
        return this.parser;
      };

      Object.assign(request, {
        responseMsToLive: hasValue(responseMsToLive) ? responseMsToLive : request.responseMsToLive,
        getResponseParser: getResponseParserFn,
        searchOptions: searchOptions,
      });

      startTime = new Date().getTime();
      this.requestService.send(request, useCachedVersionIfAvailable);
    });

    const sqr$ = href$.pipe(
      switchMap((href: string) => this.rdb.buildFromHref<SearchObjects<T>>(href)),
    );

    return this.directlyAttachIndexableObjects(sqr$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      // This skip ensures that if a stale object is present in the cache when you do a
      // call it isn't immediately returned, but we wait until the remote data for the new request
      // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
      // cached completed object
      skipWhile((rd: RemoteData<SearchObjects<T>>) => rd.isStale || (!useCachedVersionIfAvailable && rd.lastUpdated < startTime)),
    );
  }

  /**
   * Method to directly attach the indexableObjects to search results, instead of using RemoteData.
   * For compatibility with the way the search was written originally
   *
   * @param sqr$                        A {@link SearchObjects} {@link RemoteData} Observable without its
   *                                    indexableObjects attached
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @protected
   */
  protected directlyAttachIndexableObjects<T extends DSpaceObject>(sqr$: Observable<RemoteData<SearchObjects<T>>>, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
    return sqr$.pipe(
      switchMap((resultsRd: RemoteData<SearchObjects<T>>) => {
        if (hasValue(resultsRd.payload) && isNotEmpty(resultsRd.payload.page)) {
          // retrieve the indexableObjects for all search results on the page
          const searchResult$Array: Observable<SearchResult<T>>[] = resultsRd.payload.page.map((result: SearchResult<T>) =>
            this.dspaceObjectService.findByHref(result._links.indexableObject.href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow as any).pipe(
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
                  indexableObject,
                }) as SearchResult<T>;
              }),
            ),
          );

          // Swap the original page in the remoteData with the new one, now that the results have the
          // correct types, and all indexableObjects are directly attached.
          return observableCombineLatest(searchResult$Array).pipe(
            map((page: SearchResult<T>[]) => {

              const payload = Object.assign(new SearchObjects(), resultsRd.payload, {
                page,
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
            }),
          );
        }
        // If we don't have a payload, or the page is empty, simply pass on the unmodified
        // RemoteData object
        return [resultsRd];
      }),
    );
  }


  /**
   * Method to request a single page of filter values for a given value
   * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
   * @param {number} valuePage The page number of the filter values
   * @param {SearchOptions} searchOptions The search configuration for the current search
   * @param {string} filterQuery The optional query used to filter out filter values
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
   */
  getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: PaginatedSearchOptions, filterQuery?: string, useCachedVersionIfAvailable = true): Observable<RemoteData<FacetValues>> {
    let href;
    let args: string[] = [];
    if (hasValue(filterQuery)) {
      args.push(`prefix=${encodeURIComponent(filterQuery)}`);
    }
    if (hasValue(searchOptions)) {
      searchOptions = Object.assign(new PaginatedSearchOptions({}), searchOptions, {
        pagination: Object.assign({}, searchOptions.pagination, {
          currentPage: valuePage,
          pageSize: filterConfig.pageSize,
        }),
      });
      href = searchOptions.toRestUrl(filterConfig._links.self.href, args);
    } else {
      args = [`page=${valuePage - 1}`, `size=${filterConfig.pageSize}`, ...args];
      href = new URLCombiner(filterConfig._links.self.href, `?${args.join('&')}`).toString();
    }

    let request = new this.request(this.requestService.generateRequestId(), href);
    request = Object.assign(request, {
      getResponseParser(): GenericConstructor<ResponseParsingService> {
        return FacetValueResponseParsingService;
      },
    });
    const startTime = new Date().getTime();
    this.requestService.send(request, useCachedVersionIfAvailable);

    return this.rdb.buildFromHref(href).pipe(
      // This skip ensures that if a stale object is present in the cache when you do a
      // call it isn't immediately returned, but we wait until the remote data for the new request
      // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
      // cached completed object
      skipWhile((rd: RemoteData<FacetValues>) => rd.isStale || (!useCachedVersionIfAvailable && rd.lastUpdated < startTime)),
      tap((facetValuesRD: RemoteData<FacetValues>) => {
        if (facetValuesRD.hasSucceeded) {
          const appliedFilters: AppliedFilter[] = (facetValuesRD.payload.appliedFilters ?? [])
            .filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter))
            // TODO this should ideally be fixed in the backend
            .map((appliedFilter: AppliedFilter) => Object.assign({}, appliedFilter, {
              operator: hasValue(appliedFilter.value.match(/\[\s*(\*|\d+)\s*TO\s*(\*|\d+)\s*]/)) ? 'range' : appliedFilter.operator,
            }));
          this.appliedFilters$.next(appliedFilters);
        }
      }),
    );
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
   * @param {string[]} searchLinkParts
   */
  setViewMode(viewMode: ViewMode, searchLinkParts?: string[]) {
    this.paginationService.getCurrentPagination(this.searchConfigurationService.paginationID, new PaginationComponentOptions()).pipe(take(1))
      .subscribe((config) => {
        let pageParams = { page: 1 };
        const queryParams = { view: viewMode };
        if (viewMode === ViewMode.DetailedListElement) {
          pageParams = Object.assign(pageParams, { pageSize: 1 });
        } else if (config.pageSize === 1) {
          pageParams = Object.assign(pageParams, { pageSize: 10 });
        }
        this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, hasValue(searchLinkParts) ? searchLinkParts : [this.getSearchLink()], pageParams, queryParams);
      });
  }

  /**
   * Send search event to rest api using angulartics2
   * @param config              Paginated search options used
   * @param searchQueryResponse The response objects of the performed search
   * @param clickedObject       Optional UUID of an object a search was performed and clicked for
   */
  trackSearch(config: PaginatedSearchOptions, searchQueryResponse: SearchObjects<DSpaceObject>, clickedObject?: string) {
    const filters: { filter: string, operator: string, value: string, label: string; }[] = [];
    const appliedFilters = searchQueryResponse.appliedFilters || [];
    for (let i = 0, filtersLength = appliedFilters.length; i < filtersLength; i++) {
      const appliedFilter = appliedFilters[i];
      filters.push(appliedFilter);
    }
    const searchTrackObject = {
      action: 'search',
      properties: {
        searchOptions: config,
        page: {
          size: config.pagination.size, // same as searchQueryResponse.page.elementsPerPage
          totalElements: searchQueryResponse.pageInfo.totalElements,
          totalPages: searchQueryResponse.pageInfo.totalPages,
          number: config.pagination.currentPage, // same as searchQueryResponse.page.currentPage
        },
        sort: {
          by: config.sort.field,
          order: config.sort.direction,
        },
        filters: filters,
        clickedObject,
      },
    };

    this.angulartics2.eventTrack.next(searchTrackObject);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink(): string {
    return '/search';
  }

}

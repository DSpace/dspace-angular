import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, first, flatMap, map, startWith, take, tap } from 'rxjs/operators';
import { ViewMode } from '../../+search-page/search-options.model';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchSuccessResponse } from '../../core/cache/response-cache.models';
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
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SearchAppliedFilter } from './search-applied-filter.model';

function shuffle(array: any[]) {
  let i = 0;
  let j = 0;
  let temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

@Injectable()
export class SearchService extends HALEndpointService implements OnDestroy {
  protected linkPath = 'discover/search/objects';

  private sub;

  appliedFilters: SearchAppliedFilter[] = [];
  appliedFiltersSubject: BehaviorSubject<SearchAppliedFilter[]>;
  config: SearchFilterConfig[] = [];
  configSubject: BehaviorSubject<SearchFilterConfig[]>;
  searchOptions: SearchOptions;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private route: ActivatedRoute,
              private rdb: RemoteDataBuildService,
              private router: Router) {
    super();
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = {pagination: pagination, sort: sort};
    this.configSubject = new BehaviorSubject<SearchFilterConfig[]>(this.config);
    this.appliedFiltersSubject = new BehaviorSubject<SearchAppliedFilter[]>(this.appliedFilters);
    // this.searchOptions = new BehaviorSubject<SearchOptions>(searchOptions);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions, configuration?: string, filters?: any): Observable<RemoteData<Array<SearchResult<DSpaceObject>> | PaginatedList<SearchResult<DSpaceObject>>>> {
    this.configSubject.next([]);
    this.appliedFiltersSubject.next([]);
    const requestObs = this.getEndpoint().take(1).pipe(
      map((url: string) => {
        const args: string[] = [];

        if (isNotEmpty(query)) {
          args.push(`query=${query}`);
        }

        if (isNotEmpty(scopeId)) {
          args.push(`scope=${scopeId}`);
        }

        if (isNotEmpty(searchOptions)) {
          if (isNotEmpty(searchOptions.sort)) {
            args.push(`sort=${searchOptions.sort.field},${searchOptions.sort.direction}`);
          }
          if (isNotEmpty(searchOptions.pagination)) {
            args.push(`page=${searchOptions.pagination.currentPage - 1}`);
            args.push(`size=${searchOptions.pagination.pageSize}`);
          }
        }

        if (isNotEmpty(configuration)) {
          args.push(`configuration=${configuration}`);
        }

        if (isNotEmpty(filters)) {
          Object.keys(filters)
            .forEach((key) => {
              filters[key].forEach((value) => args.push(`${key}=${value}`))
            });
        }

        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }

        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return SearchResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request, true)),
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
      take(1),
      map((response: SearchSuccessResponse) => {
        // emit new facets value
        this.configSubject.next(response.results.facets);
        this.config = response.results.facets;

        // emit new applied filters value
        this.appliedFiltersSubject.next(response.results.appliedFilters);
        this.appliedFilters = response.results.appliedFilters;
        return response.results
      })
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
    const tDomainListObs: Observable<Array<SearchResult<DSpaceObject>>> = Observable.combineLatest(sqrObs, dsoObs, (sqr: SearchQueryResponse, dsos: RemoteData<DSpaceObject[]>) => {
      return sqr.objects.map((object: NormalizedSearchResult, index: number) => {
        let co = DSpaceObject;
        if (dsos.payload[index]) {
          const constructor: GenericConstructor<ListableObject> = dsos.payload[index].constructor as GenericConstructor<ListableObject>;
          co = getSearchResultFor(constructor, configuration);
          return Object.assign(new co(), object, {
            dspaceObject: dsos.payload[index]
          });
        } else {
          return undefined;
        }
      });
    });

    const pageInfoObs: Observable<PageInfo> = responseCacheObs
      .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => {
        if (hasValue((entry.response as SearchSuccessResponse).pageInfo)) {
          const resPageInfo = (entry.response as SearchSuccessResponse).pageInfo;
          if (isNotEmpty(resPageInfo) && resPageInfo.currentPage >= 0) {
            return Object.assign({}, resPageInfo, {currentPage: resPageInfo.currentPage + 1});
          } else {
            return resPageInfo;
          }
        }
      });

    const payloadObs = Observable.combineLatest(tDomainListObs, pageInfoObs, (tDomainList, pageInfo) => {
      if (hasValue(pageInfo)) {
        return new PaginatedList(pageInfo, tDomainList);
      } else {
        return tDomainList;
      }
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  getConfig(): BehaviorSubject<SearchFilterConfig[]> {
    return this.configSubject;
  }

  getAppliedFiltersFor(searchFilterConfigName: string): Observable<RemoteData<SearchAppliedFilter[]>> {
    return this.appliedFiltersSubject.pipe(
      filter((appliedFilters: SearchAppliedFilter[]) => isNotEmpty(appliedFilters)),
      map((appliedFilters: SearchAppliedFilter[]) => appliedFilters
        .filter((appliedFilter: SearchAppliedFilter) => appliedFilter.filter === searchFilterConfigName)),
      map((appliedFilters: SearchAppliedFilter[]) => {
        const requestPending = false;
        const responsePending = false;
        const isSuccessful = true;
        const error = undefined;
        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          appliedFilters
        )
      }),
      startWith(new RemoteData(
        false,
        true,
        true,
        undefined,
        []
      )),
      distinctUntilChanged()
    )
  }

  getFacetValuesFor(searchFilterConfigName: string): Observable<RemoteData<FacetValue[]>> {
    return this.getConfig().pipe(
      filter((config: SearchFilterConfig[]) => isNotUndefined(config)),
      flatMap((config: SearchFilterConfig[]) => config),
      filter((config: SearchFilterConfig) => config.name === searchFilterConfigName),
      map((config: SearchFilterConfig) => {
        const requestPending = false;
        const responsePending = false;
        const isSuccessful = true;
        const error = undefined;
        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          config.values
        )
      }),
      startWith(new RemoteData(
        false,
        true,
        true,
        undefined,
        []
      )),
      distinctUntilChanged()
    );
  }

  getViewMode(): Observable<ViewMode> {
    return this.route.queryParams.map((params) => {
      if (isNotEmpty(params.view) && hasValue(params.view)) {
        return params.view;
      } else {
        return ViewMode.List;
      }
    });
  }

  setViewMode(viewMode: ViewMode) {
    const navigationExtras: NavigationExtras = {
      queryParams: {view: viewMode},
      queryParamsHandling: 'merge'
    };

    this.router.navigate([this.getSearchLink()], navigationExtras);
  }

  getClearFiltersQueryParams(): any {
    const params = {};
    this.sub = this.route.queryParamMap
      .subscribe((paramsMap) => {
        paramsMap.keys
          .filter((key) => this.config
            .findIndex((conf: SearchFilterConfig) => conf.paramName === key) < 0)
          .forEach((key) => {
            params[key] = paramsMap.get(key);
          })
      });
    return params;
  }

  getSearchLink() {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}

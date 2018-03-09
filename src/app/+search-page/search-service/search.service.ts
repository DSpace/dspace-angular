import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { flatMap, map, tap } from 'rxjs/operators';
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
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RouteService } from '../../shared/services/route.service';
import { NormalizedSearchResult } from '../normalized-search-result.model';
import { SearchOptions } from '../search-options.model';
import { SearchResult } from '../search-result.model';
import { FacetValue } from './facet-value.model';
import { FilterType } from './filter-type.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchResponseParsingService } from '../../core/data/search-response-parsing.service';
import { SearchQueryResponse } from './search-query-response.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { getSearchResultFor } from './search-result-element-decorator';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

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
  uiSearchRoute = '/search';

  config: SearchFilterConfig[] = [
    Object.assign(new SearchFilterConfig(),
      {
        name: 'scope',
        type: FilterType.hierarchy,
        hasFacets: true,
        isOpenByDefault: true
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'author',
        type: FilterType.text,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'subject',
        type: FilterType.text,
        hasFacets: false,
        isOpenByDefault: false
      })
  ];
  // searchOptions: BehaviorSubject<SearchOptions>;
  searchOptions: SearchOptions;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private routeService: RouteService,
              private route: ActivatedRoute,
              private rdb: RemoteDataBuildService,
              private router: Router) {
    super();
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = { pagination: pagination, sort: sort };
    // this.searchOptions = new BehaviorSubject<SearchOptions>(searchOptions);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): Observable<RemoteData<Array<SearchResult<DSpaceObject>> | PaginatedList<SearchResult<DSpaceObject>>>> {
    const requestObs = this.getEndpoint().pipe(
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
      tap((request: RestRequest) => this.requestService.configure(request)),
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
    const tDomainListObs: Observable<Array<SearchResult<DSpaceObject>>> = Observable.combineLatest(sqrObs, dsoObs, (sqr: SearchQueryResponse, dsos: RemoteData<DSpaceObject[]>) => {
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

    const pageInfoObs: Observable<PageInfo> = responseCacheObs
      .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => {
        if (hasValue((entry.response as SearchSuccessResponse).pageInfo)) {
          const resPageInfo = (entry.response as SearchSuccessResponse).pageInfo;
          if (isNotEmpty(resPageInfo) && resPageInfo.currentPage >= 0) {
            return Object.assign({}, resPageInfo, { currentPage: resPageInfo.currentPage + 1 });
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

  getConfig(): Observable<RemoteData<SearchFilterConfig[]>> {
    const requestPending = false;
    const responsePending = false;
    const isSuccessful = true;
    const error = undefined;
    return Observable.of(new RemoteData(
      requestPending,
      responsePending,
      isSuccessful,
      error,
      this.config
    ));
  }

  getFacetValuesFor(searchFilterConfigName: string): Observable<RemoteData<FacetValue[]>> {
    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === searchFilterConfigName);
    return this.routeService.getQueryParameterValues(filterConfig.paramName).map((selectedValues: string[]) => {
        const payload: FacetValue[] = [];
        const totalFilters = 13;
        for (let i = 0; i < totalFilters; i++) {
          const value = searchFilterConfigName + ' ' + (i + 1);
          if (!selectedValues.includes(value)) {
            payload.push({
              value: value,
              count: Math.floor(Math.random() * 20) + 20 * (totalFilters - i), // make sure first results have the highest (random) count
              search: (decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value)}
            );
          }
        }
        const requestPending = false;
        const responsePending = false;
        const isSuccessful = true;
        const error = undefined;
        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          payload
        )
      }
    )
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
      queryParams: { view: viewMode },
      queryParamsHandling: 'merge'
    };

    this.router.navigate([this.uiSearchRoute], navigationExtras);
  }

  getClearFiltersQueryParams(): any {
    const params = {};
    this.sub = this.route.queryParamMap
      .subscribe((map) => {
        map.keys
          .filter((key) => this.config
            .findIndex((conf: SearchFilterConfig) => conf.paramName === key) < 0)
          .forEach((key) => {
            params[key] = map.get(key);
          })
      });
    return params;
  }

  getSearchLink() {
    return this.uiSearchRoute;
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}

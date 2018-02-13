import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ViewMode } from '../../+search-page/search-options.model';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { RestResponse } from '../../core/cache/response-cache.models';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { DebugResponseParsingService } from '../../core/data/debug-response-parsing.service';
import { DSOResponseParsingService } from '../../core/data/dso-response-parsing.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { ResponseParsingService } from '../../core/data/parsing.service';
import { RemoteData } from '../../core/data/remote-data';
import { GetRequest, EndpointMapRequest, RestRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { DSpaceRESTV2Response } from '../../core/dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Item } from '../../core/shared/item.model';
import { Metadatum } from '../../core/shared/metadatum.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ItemSearchResult } from '../../shared/object-collection/shared/item-search-result.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RouteService } from '../../shared/route.service';
import { SearchOptions } from '../search-options.model';
import { SearchResult } from '../search-result.model';
import { FacetValue } from './facet-value.model';
import { FilterType } from './filter-type.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchResponseParsingService } from '../../core/data/search-response-parsing.service';

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

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    private itemDataService: ItemDataService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    private routeService: RouteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = { pagination: pagination, sort: sort };
    // this.searchOptions = new BehaviorSubject<SearchOptions>(searchOptions);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): Observable<RemoteData<Array<SearchResult<DSpaceObject>>>> {
    const searchEndpointUrlObs = this.getEndpoint();
    searchEndpointUrlObs.pipe(
      map((url: string) => {
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return SearchResponseParsingService;
          }
        });
      })
    ).subscribe((request: RestRequest) => this.requestService.configure(request));
    return Observable.of(undefined);
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
              search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
            });
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

import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { SearchFiltersState, SearchFilterState } from './search-filter.reducer';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  SearchFilterCollapseAction,
  SearchFilterDecrementPageAction, SearchFilterExpandAction,
  SearchFilterIncrementPageAction,
  SearchFilterInitialCollapseAction,
  SearchFilterInitialExpandAction, SearchFilterResetPageAction,
  SearchFilterToggleAction
} from './search-filter.actions';
import { hasValue, isEmpty, isNotEmpty, } from '../../../shared/empty.util';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchService } from '../../search-service/search.service';
import { RouteService } from '../../../shared/route.service';
import ObjectExpression from 'rollup/dist/typings/ast/nodes/ObjectExpression';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../../search-options.model';
import { PaginatedSearchOptions } from '../../paginated-search-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { configureRequest } from '../../../core/shared/operators';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { GetRequest, RestRequest } from '../../../core/data/request.models';
import { FacetConfigSuccessResponse } from '../../../core/cache/response-cache.models';
import { ResponseCacheEntry } from '../../../core/cache/response-cache.reducer';
import { RequestService } from '../../../core/data/request.service';
import { ResponseCacheService } from '../../../core/cache/response-cache.service';
import { SearchResponseParsingService } from '../../../core/data/search-response-parsing.service';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { GenericConstructor } from '../../../core/shared/generic-constructor';


@Injectable()
export class SearchFixedFilterService {
  private queryByFilterPath = 'config/filtered-discovery-pages';

  constructor(private routeService: RouteService,
              protected requestService: RequestService,
              protected responseCache: ResponseCacheService,
              private halService: HALEndpointService) {

  }

  getQueryByFilterName(filterName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    const requestObs = this.halService.getEndpoint(this.queryByFilterPath).pipe(
      map((url: string) => {
        url += ('/' + filterName);
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FilterDiscoveryPageResponseParsingService;
          }
        });
      }),
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const fixedFilterConfigObs: Observable<SearchFilterConfig[]> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetConfigSuccessResponse) =>
        response.results.map((result: any) => Object.assign(new SearchFilterConfig(), result)))
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, facetConfigObs);
  }

}

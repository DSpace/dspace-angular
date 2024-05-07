import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  createSelector,
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
} from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { InputSuggestion } from '../../../shared/input-suggestions/input-suggestions.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { FacetValue } from '../../../shared/search/models/facet-value.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchOptions } from '../../../shared/search/models/search-options.model';
import {
  getFacetValueForType,
  stripOperatorFromFilterValue,
} from '../../../shared/search/search.utils';
import {
  SearchFilterCollapseAction,
  SearchFilterDecrementPageAction,
  SearchFilterExpandAction,
  SearchFilterIncrementPageAction,
  SearchFilterInitializeAction,
  SearchFilterMinimizeAllPageAction,
  SearchFilterResetPageAction,
  SearchFilterToggleAction,
} from '../../../shared/search/search-filters/search-filter/search-filter.actions';
import {
  SearchFiltersState,
  SearchFilterState,
} from '../../../shared/search/search-filters/search-filter/search-filter.reducer';
import { EmphasizePipe } from '../../../shared/utils/emphasize.pipe';
import {
  SortDirection,
  SortOptions,
} from '../../cache/models/sort-options.model';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { RouteService } from '../../services/route.service';
import { getFirstSucceededRemoteData } from '../operators';
import { SearchService } from './search.service';

const filterStateSelector = (state: SearchFiltersState) => state.searchFilter;

/**
 * Service that performs all actions that have to do with search filters and facets
 */
@Injectable({ providedIn: 'root' })
export class SearchFilterService {

  constructor(
    protected searchService: SearchService,
    protected store: Store<SearchFiltersState>,
    protected routeService: RouteService,
  ) {
  }

  /**
   * Checks if a given filter is active with a given value
   * @param {string} paramName The parameter name of the filter's configuration for which to search
   * @param {string} filterValue The value for which to search
   * @returns {Observable<boolean>} Emit true when the filter is active with the given value
   */
  isFilterActiveWithValue(paramName: string, filterValue: string): Observable<boolean> {
    return this.routeService.hasQueryParamWithValue(paramName, filterValue);
  }

  /**
   * Checks if a given filter is active with any value
   * @param {string} paramName The parameter name of the filter's configuration for which to search
   * @returns {Observable<boolean>} Emit true when the filter is active with any value
   */
  isFilterActive(paramName: string): Observable<boolean> {
    return this.routeService.hasQueryParam(paramName);
  }

  /**
   * Fetch the current active scope from the query parameters
   * @returns {Observable<string>}
   */
  getCurrentScope(): Observable<string> {
    return this.routeService.getQueryParameterValue('scope');
  }

  /**
   * Fetch the current query from the query parameters
   * @returns {Observable<string>}
   */
  getCurrentQuery(): Observable<string> {
    return this.routeService.getQueryParameterValue('query');
  }

  /**
   * Fetch the current pagination from query parameters 'page' and 'pageSize'
   * and combine them with a given pagination
   * @param pagination      Pagination options to combine the query parameters with
   * @returns {Observable<PaginationComponentOptions>}
   */
  getCurrentPagination(pagination: any = {}): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue('page');
    const size$ = this.routeService.getQueryParameterValue('pageSize');
    return observableCombineLatest(page$, size$).pipe(map(([page, size]) => {
      return Object.assign(new PaginationComponentOptions(), pagination, {
        currentPage: page || 1,
        pageSize: size || pagination.pageSize,
      });
    }));
  }

  /**
   * Fetch the current sorting options from query parameters 'sortDirection' and 'sortField'
   * and combine them with given sorting options
   * @param {SortOptions} defaultSort       Sorting options to combine the query parameters with
   * @returns {Observable<SortOptions>}
   */
  getCurrentSort(defaultSort: SortOptions): Observable<SortOptions> {
    const sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
    const sortField$ = this.routeService.getQueryParameterValue('sortField');
    return observableCombineLatest(sortDirection$, sortField$).pipe(map(([sortDirection, sortField]) => {
      const field = sortField || defaultSort.field;
      const direction = SortDirection[sortDirection] || defaultSort.direction;
      return new SortOptions(field, direction);
    },
    ));
  }

  /**
   * Fetch the current active filters from the query parameters
   * @returns {Observable<Params>}
   */
  getCurrentFilters(): Observable<Params> {
    return this.routeService.getQueryParamsWithPrefix('f.');
  }

  /**
   * Fetch the current view from the query parameters
   * @returns {Observable<string>}
   */
  getCurrentView(): Observable<string> {
    return this.routeService.getQueryParameterValue('view');
  }

  /**
   * Updates the found facet value suggestions for a given query
   * Transforms the found values into display values
   *
   * @param searchFilterConfig The search filter config
   * @param searchOptions The search options
   * @param query The query for which is being searched
   */
  findSuggestions(searchFilterConfig: SearchFilterConfig, searchOptions: SearchOptions, query: string): Observable<InputSuggestion[]> {
    if (isNotEmpty(query)) {
      return this.searchService.getFacetValuesFor(searchFilterConfig, 1, searchOptions, query.toLowerCase()).pipe(
        getFirstSucceededRemoteData(),
        map((rd: RemoteData<PaginatedList<FacetValue>>) => rd.payload.page.map((facet) => {
          return {
            displayValue: this.getDisplayValue(facet, query),
            query: getFacetValueForType(facet, searchFilterConfig),
            value: stripOperatorFromFilterValue(getFacetValueForType(facet, searchFilterConfig)),
          };
        })),
      );
    } else {
      return observableOf([]);
    }
  }

  /**
   * Transforms the facet value string, so if the query matches part of the value, it's emphasized in the value
   *
   * @param facet The value of the facet as returned by the server
   * @param query The query that was used to search facet values
   * @returns {string} The facet value with the query part emphasized
   */
  getDisplayValue(facet: FacetValue, query: string): string {
    return `${new EmphasizePipe().transform(facet.value, query)} (${facet.count})`;
  }

  /**
   * Checks if the state of a given filter is currently collapsed or not
   * @param {string} filterName The filtername for which the collapsed state is checked
   * @returns {Observable<boolean>} Emits the current collapsed state of the given filter, if it's unavailable, return false
   */
  isCollapsed(filterName: string): Observable<boolean> {
    return this.store.pipe(
      select(filterByNameSelector(filterName)),
      map((object: SearchFilterState) => {
        if (object) {
          return object.filterCollapsed || object.minimized;
        } else {
          return false;
        }
      }),
      distinctUntilChanged(),
    );
  }

  /**
   * Request the current page of a given filter
   * @param {string} filterName The filter name for which the page state is checked
   * @returns {Observable<boolean>} Emits the current page state of the given filter, if it's unavailable, return 1
   */
  getPage(filterName: string): Observable<number> {
    return this.store.pipe(
      select(filterByNameSelector(filterName)),
      map((object: SearchFilterState) => {
        if (object) {
          return object.page;
        } else {
          return 1;
        }
      }),
      distinctUntilChanged());
  }

  /**
   * Dispatches a collapse action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public collapse(filterName: string): void {
    this.store.dispatch(new SearchFilterCollapseAction(filterName));
  }

  /**
   * Dispatches an expand action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public expand(filterName: string): void {
    this.store.dispatch(new SearchFilterExpandAction(filterName));
  }

  /**
   * Dispatches a toggle action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public toggle(filterName: string): void {
    this.store.dispatch(new SearchFilterToggleAction(filterName));
  }

  /**
   * Dispatches an initialize action to the store for a given filter
   * @param {SearchFilterConfig} filter The filter for which the action is dispatched
   */
  public initializeFilter(filter: SearchFilterConfig): void {
    this.store.dispatch(new SearchFilterInitializeAction(filter));
  }

  /**
   * Dispatches a decrement action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public decrementPage(filterName: string): void {
    this.store.dispatch(new SearchFilterDecrementPageAction(filterName));
  }

  /**
   * Dispatches an increment page action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public incrementPage(filterName: string): void {
    this.store.dispatch(new SearchFilterIncrementPageAction(filterName));
  }

  /**
   * Dispatches a reset page action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public resetPage(filterName: string): void {
    this.store.dispatch(new SearchFilterResetPageAction(filterName));
  }

  public minimizeAll(): void {
    this.store.dispatch(new SearchFilterMinimizeAllPageAction());
  }
}

function filterByNameSelector(name: string): MemoizedSelector<SearchFiltersState, SearchFilterState> {
  return keySelector<SearchFilterState>(name);
}

export function keySelector<T>(key: string): MemoizedSelector<SearchFiltersState, T> {
  return createSelector(filterStateSelector, (state: SearchFilterState) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}

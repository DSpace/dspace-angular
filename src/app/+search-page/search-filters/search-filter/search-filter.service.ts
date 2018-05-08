import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
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

const filterStateSelector = (state: SearchFiltersState) => state.searchFilter;

@Injectable()
export class SearchFilterService {

  constructor(private store: Store<SearchFiltersState>,
              private routeService: RouteService) {
  }

  isFilterActiveWithValue(paramName: string, filterValue: string): Observable<boolean> {
    return this.routeService.hasQueryParamWithValue(paramName, filterValue);
  }

  isFilterActive(paramName: string): Observable<boolean> {
    return this.routeService.hasQueryParam(paramName);
  }

  getCurrentScope() {
    return this.routeService.getQueryParameterValue('scope');
  }

  getCurrentQuery() {
    return this.routeService.getQueryParameterValue('query');
  }

  getCurrentPagination(pagination: any = {}): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue('page');
    const size$ = this.routeService.getQueryParameterValue('pageSize');
    return Observable.combineLatest(page$, size$, (page, size) => {
      return Object.assign(new PaginationComponentOptions(), pagination, {
        currentPage: page || 1,
        pageSize: size || pagination.pageSize
      });
    });
  }

  getCurrentSort(defaultSort: SortOptions): Observable<SortOptions> {
    const sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
    const sortField$ = this.routeService.getQueryParameterValue('sortField');
    return Observable.combineLatest(sortDirection$, sortField$, (sortDirection, sortField) => {
        const field = sortField || defaultSort.field;
        const direction = SortDirection[sortDirection] || defaultSort.direction;
        return new SortOptions(field, direction)
      }
    );
  }

  getCurrentFilters() {
    return this.routeService.getQueryParamsWithPrefix('f.');
  }

  getCurrentView() {
    return this.routeService.getQueryParameterValue('view');
  }

  getPaginatedSearchOptions(defaults: any = {}): Observable<PaginatedSearchOptions> {
    return Observable.combineLatest(
      this.getCurrentPagination(defaults.pagination),
      this.getCurrentSort(defaults.sort),
      this.getCurrentView(),
      this.getCurrentScope(),
      this.getCurrentQuery(),
      this.getCurrentFilters()).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      map(([pagination, sort, view, scope, query, filters]) => {
        return Object.assign(new PaginatedSearchOptions(),
          defaults,
          {
            pagination: pagination,
            sort: sort,
            view: view,
            scope: scope || defaults.scope,
            query: query,
            filters: filters
          })
      })
    )
  }

  getSearchOptions(defaults: any = {}): Observable<SearchOptions> {
    return Observable.combineLatest(
      this.getCurrentView(),
      this.getCurrentScope(),
      this.getCurrentQuery(),
      this.getCurrentFilters(),
      (view, scope, query, filters) => {
        return Object.assign(new SearchOptions(),
          defaults,
          {
            view: view,
            scope: scope || defaults.scope,
            query: query,
            filters: filters
          })
      }
    )
  }

  getSelectedValuesForFilter(filterConfig: SearchFilterConfig): Observable<string[]> {
    return this.routeService.getQueryParameterValues(filterConfig.paramName);
  }

  isCollapsed(filterName: string): Observable<boolean> {
    return this.store.select(filterByNameSelector(filterName))
      .map((object: SearchFilterState) => {
        if (object) {
          return object.filterCollapsed;
        } else {
          return false;
        }
      });
  }

  getPage(filterName: string): Observable<number> {
    return this.store.select(filterByNameSelector(filterName))
      .map((object: SearchFilterState) => {
        if (object) {
          return object.page;
        } else {
          return 1;
        }
      });
  }

  public collapse(filterName: string): void {
    this.store.dispatch(new SearchFilterCollapseAction(filterName));
  }

  public expand(filterName: string): void {
    this.store.dispatch(new SearchFilterExpandAction(filterName));
  }

  public toggle(filterName: string): void {
    this.store.dispatch(new SearchFilterToggleAction(filterName));
  }

  public initialCollapse(filterName: string): void {
    this.store.dispatch(new SearchFilterInitialCollapseAction(filterName));
  }

  public initialExpand(filterName: string): void {
    this.store.dispatch(new SearchFilterInitialExpandAction(filterName));
  }

  public decrementPage(filterName: string): void {
    this.store.dispatch(new SearchFilterDecrementPageAction(filterName));
  }

  public incrementPage(filterName: string): void {
    this.store.dispatch(new SearchFilterIncrementPageAction(filterName));
  }

  public resetPage(filterName: string): void {
    this.store.dispatch(new SearchFilterResetPageAction(filterName));
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

import { Injectable } from '@angular/core';
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
import { hasValue, } from '../../../shared/empty.util';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchService } from '../../search-service/search.service';
import { RouteService } from '../../../shared/route.service';

const filterStateSelector = (state: SearchFiltersState) => state.searchFilter;

@Injectable()
export class SearchFilterService {

  constructor(private store: Store<SearchFiltersState>,
              private routeService: RouteService,
              private searchService: SearchService) {
  }

  isFilterActiveWithValue(paramName: string, filterValue: string): Observable<boolean> {
    return this.routeService.hasQueryParamWithValue(paramName, filterValue);
  }

  isFilterActive(paramName: string): Observable<boolean> {
    return this.routeService.hasQueryParam(paramName);
  }

  getQueryParamsWithout(filterConfig: SearchFilterConfig, value: string) {
    return this.routeService.removeQueryParameterValue(filterConfig.paramName, value);
  }

  getQueryParamsWith(filterConfig: SearchFilterConfig, value: string) {
    return this.routeService.addQueryParameterValue(filterConfig.paramName, value);
  }

  getSelectedValuesForFilter(filterConfig: SearchFilterConfig): Observable<string[]> {
    return this.routeService.getQueryParameterValues(filterConfig.paramName);
  }

  get searchLink() {
    return this.searchService.uiSearchRoute;
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

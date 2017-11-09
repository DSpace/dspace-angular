import { Injectable, OnDestroy } from '@angular/core';
import { SearchFiltersState, SearchFilterState } from './search-filter.reducer';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../app.reducer';
import {
  SearchFilterCollapseAction, SearchFilterDecreasePageAction, SearchFilterIncreasePageAction,
  SearchFilterInitialCollapseAction,
  SearchFilterInitialExpandAction,
  SearchFilterToggleAction
} from './search-filter.actions';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FacetValue } from '../../search-service/facet-value.model';
import { FilterType } from '../../search-service/filter-type.model';
import { SearchService } from '../../search-service/search.service';

const filterStateSelector = (state: SearchFiltersState) => state.searchFilter;

@Injectable()
export class SearchFilterService {

  constructor(private store: Store<SearchFiltersState>,
              private route: ActivatedRoute,
              private searchService: SearchService) {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
    })
  }

  isFilterActive(paramName: string, filterValue: string): Observable<boolean> {
    return this.route.queryParamMap.map((map) => map.getAll(paramName).indexOf(filterValue) > -1 );
  }

  getFilterValueURL(filterConfig: SearchFilterConfig, value: string): Observable<Params> {
    return this.isFilterActive(filterConfig.paramName, value).flatMap((isActive) => {
      if (isActive) {
        return this.removeQueryParameter(filterConfig.paramName, value);
      } else {
        return this.addQueryParameter(filterConfig.paramName, value);
      }
    })
  }

  addQueryParameter(paramName: string, value: string): Observable<Params> {
    return this.route.queryParams.map((currentParams) => {
      const newParam = {};
      newParam[paramName] = [...convertToParamMap(currentParams).getAll(paramName), value];
      return Object.assign({}, currentParams, newParam);
    });
  }

  removeQueryParameter(paramName: string, value: string): Observable<Params> {
    return this.route.queryParams.map((currentParams) => {
      const newParam = {};
      const currentFilterParams = convertToParamMap(currentParams).getAll(paramName);
      if (isNotEmpty(currentFilterParams)) {
        newParam[paramName] = currentFilterParams.filter((param) => (param !== value));
      }
      console.log(Object.assign({}, currentParams, newParam));
      return Object.assign({}, currentParams, newParam);
    });

  }

  get searchLink() {
    return this.searchService.searchLink;
  }

  isCollapsed(filterName: string): Observable<boolean> {
    return this.store.select(filterByNameSelector(filterName))
      .map((object: SearchFilterState) => object.filterCollapsed);
  }

  getPage(filterName: string): Observable<number> {
    return this.store.select(filterByNameSelector(filterName))
      .map((object: SearchFilterState) => object.page);
  }

  public collapse(filterName: string): void {
    this.store.dispatch(new SearchFilterCollapseAction(filterName));
  }

  public expand(filterName: string): void {
    this.store.dispatch(new SearchFilterCollapseAction(filterName));
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

  public decreasePage(filterName: string): void {
    this.store.dispatch(new SearchFilterDecreasePageAction(filterName));
  }

  public increasePage(filterName: string): void {
    this.store.dispatch(new SearchFilterIncreasePageAction(filterName));
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

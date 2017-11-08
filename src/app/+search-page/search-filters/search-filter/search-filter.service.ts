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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FacetValue } from '../../search-service/facet-value.model';
import { FilterType } from '../../search-service/filter-type.model';
import { SearchService } from '../../search-service/search.service';

const filterStateSelector = (state: SearchFiltersState) => state.searchFilter;

@Injectable()
export class SearchFilterService implements OnDestroy {
  private sub;

  constructor(private store: Store<SearchFiltersState>,
              private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService) {
  }

  isFilterActive(filterName: string, filterValue: string): boolean {
    let filterConfig: SearchFilterConfig;
    this.sub = this.searchService.getConfig().payload
      .subscribe((configuration) => filterConfig = configuration
        .find((config: SearchFilterConfig) => config.name === filterName));
    return isNotEmpty(this.route.snapshot.queryParams[filterConfig.paramName]) && [...this.route.snapshot.queryParams[filterConfig.paramName]].indexOf(filterValue, 0) > -1;
  }

  switchFilterInURL(filterConfig: SearchFilterConfig, value: string) {
    console.log(this.route.snapshot.queryParams);
    if (this.isFilterActive(filterConfig.name, value)) {
      return this.removeQueryParameter(filterConfig.paramName, value);
    } else {
      return this.addQueryParameter(filterConfig.paramName, value);
    }
  }

  addQueryParameter(paramName: string, value: string): Params {
    const currentParams = this.route.snapshot.queryParams;
    const newParam = {};
    if ((currentParams[paramName])) {
      newParam[paramName] = [...currentParams[paramName], value];
    } else {
      newParam[paramName] = [value];
    }
    return Object.assign({}, currentParams, newParam);
  }

  removeQueryParameter(paramName: string, value: string): Params {
    const currentParams = this.route.snapshot.queryParams;
    const newParam = {};
    let currentFilterParams = [...currentParams[paramName]];
    if (isNotEmpty(currentFilterParams)) {
      const index = currentFilterParams.indexOf(value, 0);
      if (index > -1) {
        currentFilterParams = currentFilterParams.splice(index, 1);
      }
      newParam[paramName] = currentFilterParams;
    }
    return Object.assign({}, currentParams, newParam);
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

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
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

import { Params } from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SearchFilterConfig } from '../search/models/search-filter-config.model';

/* eslint-disable no-empty,@typescript-eslint/no-empty-function */
/**
 * Stub class of {@link SearchFilterService}
 */
export class SearchFilterServiceStub {

  isFilterActiveWithValue(_paramName: string, _filterValue: string, _searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<boolean> {
    return of(true);
  }

  isFilterActive(_paramName: string, _searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<boolean> {
    return of(true);
  }

  getCurrentScope(_searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<string> {
    return of(undefined);
  }

  getCurrentQuery(_searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<string> {
    return of(undefined);
  }

  getCurrentPagination(_pagination: any = {}): Observable<PaginationComponentOptions> {
    return Object.assign(new PaginationComponentOptions());
  }

  getCurrentSort(_defaultSort: SortOptions): Observable<SortOptions> {
    return of(new SortOptions('', SortDirection.ASC));
  }

  getCurrentFilters(_searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<Params> {
    return of({});
  }

  getCurrentView(_searchInstanceId?: string, _useLegacySearchParamFallback = true): Observable<string> {
    return of(undefined);
  }

  isCollapsed(_filterName: string): Observable<boolean> {
    return of(true);
  }

  getPage(_filterName: string): Observable<number> {
    return of(1);
  }

  collapse(_filterName: string): void {
  }

  expand(_filterName: string): void {
  }

  toggle(_filterName: string): void {
  }

  initializeFilter(_filter: SearchFilterConfig): void {
  }

  decrementPage(_filterName: string): void {
  }

  incrementPage(_filterName: string): void {
  }

  resetPage(_filterName: string): void {
  }

  minimizeAll(): void {
  }

}

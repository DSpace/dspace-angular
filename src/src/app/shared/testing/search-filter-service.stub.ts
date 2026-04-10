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

  isFilterActiveWithValue(_paramName: string, _filterValue: string): Observable<boolean> {
    return of(true);
  }

  isFilterActive(_paramName: string): Observable<boolean> {
    return of(true);
  }

  getCurrentScope(): Observable<string> {
    return of(undefined);
  }

  getCurrentQuery(): Observable<string> {
    return of(undefined);
  }

  getCurrentPagination(_pagination: any = {}): Observable<PaginationComponentOptions> {
    return Object.assign(new PaginationComponentOptions());
  }

  getCurrentSort(_defaultSort: SortOptions): Observable<SortOptions> {
    return of(new SortOptions('', SortDirection.ASC));
  }

  getCurrentFilters(): Observable<Params> {
    return of({});
  }

  getCurrentView(): Observable<string> {
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

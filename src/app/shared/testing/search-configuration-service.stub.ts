import { Params } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';

import {
  FilterConfig,
  SearchConfig,
} from '../../core/shared/search/search-filters/search-config.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { SearchOptions } from '../search/models/search-options.model';

/**
 * Stub class of {@link SearchConfigurationService}
 */
export class SearchConfigurationServiceStub {

  public searchInstanceId = 'test-id';

  public useLegacySearchParamFallback = true;

  public searchOptions: BehaviorSubject<SearchOptions> = new BehaviorSubject(new SearchOptions({}));
  public paginatedSearchOptions: BehaviorSubject<PaginatedSearchOptions> = new BehaviorSubject(new PaginatedSearchOptions({}));

  getCurrentFrontendFilters() {
    return of([]);
  }

  getCurrentFilters() {
    return of([]);
  }

  getCurrentSearchInstanceParam(param: string) {
    return `${this.searchInstanceId}.${param}`;
  }

  getSearchParamFromParams(params: Params, parameterName: string, searchInstanceId = this.searchInstanceId) {
    return params?.[`${searchInstanceId}.${parameterName}`] ?? params?.[parameterName];
  }

  getCurrentSearchInstanceFilterParam(param: string) {
    return `${this.searchInstanceId}.${param}`;
  }

  getCurrentPageParam() {
    return `${this.searchInstanceId}.page`;
  }

  getCurrentScope(a) {
    return of('test-id');
  }

  getCurrentQuery(a) {
    return of(a);
  }

  getCurrentConfiguration(a) {
    return of(a);
  }

  getCurrentViewMode(defaultViewMode: ViewMode) {
    return of(defaultViewMode);
  }

  getConfigurationAdvancedSearchFilters(_configuration: string, _scope?: string): Observable<FilterConfig[]> {
    return of([]);
  }

  getConfig () {
    return of({ hasSucceeded: true, payload: [] });
  }

  getConfigurationSearchConfig(_configuration: string, _scope?: string): Observable<SearchConfig> {
    return of(new SearchConfig());
  }

  getAvailableConfigurationOptions() {
    return of([{ value: 'test', label: 'test' }]);
  }

  unselectAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return of({});
  }

  selectNewAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return of({});
  }

}

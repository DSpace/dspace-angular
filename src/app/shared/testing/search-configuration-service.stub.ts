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
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { SearchOptions } from '../search/models/search-options.model';

/**
 * Stub class of {@link SearchConfigurationService}
 */
export class SearchConfigurationServiceStub {

  public paginationID = 'test-id';

  public searchOptions: BehaviorSubject<SearchOptions> = new BehaviorSubject(new SearchOptions({}));
  public paginatedSearchOptions: BehaviorSubject<PaginatedSearchOptions> = new BehaviorSubject(new PaginatedSearchOptions({}));

  getCurrentFrontendFilters() {
    return of([]);
  }

  getCurrentFilters() {
    return of([]);
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

import { Params } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of as observableOf,
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
    return observableOf([]);
  }

  getCurrentScope(a) {
    return observableOf('test-id');
  }

  getCurrentQuery(a) {
    return observableOf(a);
  }

  getCurrentConfiguration(a) {
    return observableOf(a);
  }

  getConfigurationAdvancedSearchFilters(_configuration: string, _scope?: string): Observable<FilterConfig[]> {
    return observableOf([]);
  }

  getConfig () {
    return observableOf({ hasSucceeded: true, payload: [] });
  }

  getConfigurationSearchConfig(_configuration: string, _scope?: string): Observable<SearchConfig> {
    return observableOf(new SearchConfig());
  }

  getAvailableConfigurationOptions() {
    return observableOf([{ value: 'test', label: 'test' }]);
  }

  unselectAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return observableOf({});
  }

  selectNewAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return observableOf({});
  }

}

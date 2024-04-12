import { BehaviorSubject, of as observableOf, Observable } from 'rxjs';
import { Params } from '@angular/router';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';

export class SearchConfigurationServiceStub {

  public paginationID = 'test-id';

  private searchOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private paginatedSearchOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});

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

  getConfig () {
    return observableOf({ hasSucceeded: true, payload: [] });
  }

  getConfigurationSearchConfig(_configuration: string, _scope?: string): Observable<SearchConfig> {
    return observableOf(new SearchConfig());
  }

  getAvailableConfigurationOptions() {
    return observableOf([{value: 'test', label: 'test'}]);
  }

  unselectAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return observableOf({});
  }

  selectNewAppliedFilterParams(_filterName: string, _value: string, _operator?: string): Observable<Params> {
    return observableOf({});
  }

}

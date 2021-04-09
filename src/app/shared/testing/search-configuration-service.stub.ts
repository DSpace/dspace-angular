import { BehaviorSubject, of as observableOf } from 'rxjs';

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

  getCurrentConfiguration(a) {
    return observableOf(a);
  }
}

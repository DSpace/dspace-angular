import {
  Observable,
  of as observableOf,
} from 'rxjs';

export class SiteDataServiceStub {
  find(): Observable<any> {
    return observableOf({});
  }
}


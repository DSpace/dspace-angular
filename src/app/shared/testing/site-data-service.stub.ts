import {of as observableOf,  Observable } from 'rxjs';

export class SiteDataServiceStub {
  find(): Observable<any> {
    return observableOf({});
  }
}


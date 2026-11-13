import {
  Observable,
  of,
} from 'rxjs';

export class SiteDataServiceStub {
  find(): Observable<any> {
    return of({});
  }
}


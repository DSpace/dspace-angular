import { Observable, of as observableOf } from 'rxjs';

export class DataServiceStub {

  invalidateByHref(_href: string): Observable<boolean> {
    return observableOf(true);
  }

}

import {of as observableOf,  Observable } from 'rxjs';

export class ExportServiceStub {
  export(): Observable<any> {
    return observableOf({});
  }
}


import {
  Observable,
  of as observableOf,
} from 'rxjs';

export class ExportServiceStub {
  export(): Observable<any> {
    return observableOf({});
  }
}


import {
  Observable,
  of,
} from 'rxjs';

export class ExportServiceStub {
  export(): Observable<any> {
    return of({});
  }
}


import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(public _http: HttpClient) {

  }

  /**
   * whatever domain/feature method name
   */
  get(url: string, options?: any) {
    return this._http.get(url, options).pipe(
      catchError((err) => {
        console.log('Error: ', err);
        return observableThrowError(err);
      }));
  }

}

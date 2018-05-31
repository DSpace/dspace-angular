import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {
  constructor(public _http: HttpClient) {

  }

  /**
   * whatever domain/feature method name
   */
  get(url: string, options?: any) {
    return this._http.get(url, options)
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}

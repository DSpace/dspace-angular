import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

/**
 * Service to access DSpace's REST API
 */
@Injectable()
export class DSpaceRESTv2Service {

  constructor(private http: HttpClient) {

  }

  /**
   * Performs a request to the REST API with the `get` http method.
   *
   * @param absoluteURL
   *      A URL
   * @param options
   *      An object, with options for the http call.
   * @return {Observable<DSpaceRESTV2Response>}
   *      An Observable<DSpaceRESTV2Response> containing the response from the server
   */
  get(absoluteURL: string, options?: {}): Observable<DSpaceRESTV2Response> {
    return this.http.get(absoluteURL, options)
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}

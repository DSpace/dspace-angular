import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';

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
  get(absoluteURL: string): Observable<DSpaceRESTV2Response> {
    return this.http.get(absoluteURL, { observe: 'response' })
      .map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}

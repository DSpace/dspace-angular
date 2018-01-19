import { Injectable } from '@angular/core';
import { Request } from '@angular/http';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { RestRequestMethod } from '../data/request.models';

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
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  get(absoluteURL: string): Observable<DSpaceRESTV2Response> {
    return this.http.get(absoluteURL, { observe: 'response' })
      .map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

  /**
   * Performs a request to the REST API.
   *
   * @param method
   *    the HTTP method for the request
   * @param url
   *    the URL for the request
   * @param body
   *    an optional body for the request
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  request(method: RestRequestMethod, url: string, body?: any): Observable<DSpaceRESTV2Response> {
    return this.http.request(method, url, { body, observe: 'response' })
      .map((res) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}

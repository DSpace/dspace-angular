import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RequestOptionsArgs } from '@angular/http';
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
   * Performs a request to the REST API with the `delte` http method.
   *
   * @param absoluteURL
   *      A URL
   * @param options
   *      A RequestOptionsArgs object, with options for the http call.
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  delete(absoluteURL: string, options?: RequestOptionsArgs): Observable<DSpaceRESTV2Response> {
    return this.http.delete(absoluteURL, {observe: 'response'})
      .map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
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

  /**
   * Performs a request to the REST API with the `post` http method.
   *
   * @param absoluteURL
   *      A URL
   * @param body
   *      The request body
   * @param options
   *      A RequestOptionsArgs object, with options for the http call.
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  post(absoluteURL: string, body: any, options?: RequestOptionsArgs): Observable<DSpaceRESTV2Response> {
    return this.http.post(absoluteURL, body, {observe: 'response'})
      .map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

  /**
   * Performs a request to the REST API with the `patch` http method.
   *
   * @param absoluteURL
   *      A URL
   * @param body
   *      The request body
   * @param options
   *      A RequestOptionsArgs object, with options for the http call.
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  patch(absoluteURL: string, body: any, options?: RequestOptionsArgs): Observable<DSpaceRESTV2Response> {
    options = {};
    const headers = {
      headers: new HttpHeaders().set('\'Content-Type', 'application/json; charset=UTF-8'),
      observe: 'response'
    };
    return this.http.patch(absoluteURL, body, {
      headers: new HttpHeaders().set('\'Content-Type', 'application/json; charset=UTF-8'),
      observe: 'response'
    })
      .map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }
}

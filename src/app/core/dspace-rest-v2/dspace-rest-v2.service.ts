import { Injectable } from '@angular/core';
import { Request } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { RestRequestMethod } from '../data/request.models';

import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';
import { HttpObserve } from '@angular/common/http/src/client';

export interface HttpOptions {
  body?: any;
  headers?: HttpHeaders;
  params?: HttpParams;
  observe?: HttpObserve;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

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
  request(method: RestRequestMethod, url: string, body?: any, options?: HttpOptions): Observable<DSpaceRESTV2Response> {
    const requestOptions: HttpOptions = {};
    requestOptions.body = body;
    requestOptions.observe = 'response';
    if (options && options.headers) {
      requestOptions.headers = Object.assign(new HttpHeaders(),  options.headers);
    }
    if (options && options.responseType) {
      requestOptions.responseType = options.responseType;
    }
    return this.http.request(method, url, requestOptions)
      .map((res) => ({ payload: res.body, headers: res.headers, statusCode: res.status }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}

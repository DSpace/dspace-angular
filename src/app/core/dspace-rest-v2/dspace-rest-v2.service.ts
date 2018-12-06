import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { Injectable } from '@angular/core';
import { Request } from '@angular/http';

import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';
import { RestRequestMethod } from '../data/request.models';

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
    return this.http.get(absoluteURL, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.statusText })),
      catchError((err) => {
        console.log('Error: ', err);
        return observableThrowError(err);
      }));
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
    return this.http.request(method, url, requestOptions).pipe(
      map((res) => ({ payload: res.body, headers: res.headers, statusCode: res.statusText })),
      catchError((err) => {
        console.log('Error: ', err);
        return observableThrowError(err);
      }));
  }

}

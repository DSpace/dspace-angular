import {throwError as observableThrowError,  Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'

import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';
import { HttpObserve } from '@angular/common/http/src/client';
import { RestRequestMethod } from '../data/rest-request-method';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';

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
      map((res: HttpResponse<any>) => ({ payload: res.body, statusCode: res.status, statusText: res.statusText })),
      catchError((err) => {
        console.log('Error: ', err);
        return observableThrowError({statusCode: err.status, statusText: err.statusText, message: err.message});
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
    if (method === RestRequestMethod.POST && isNotEmpty(body) && isNotEmpty(body.name)) {
      requestOptions.body = this.buildFormData(body);
    }
    requestOptions.observe = 'response';
    if (options && options.headers) {
      requestOptions.headers = Object.assign(new HttpHeaders(),  options.headers);
    }
    if (options && options.responseType) {
      requestOptions.responseType = options.responseType;
    }
    return this.http.request(method, url, requestOptions).pipe(
      map((res) => ({ payload: res.body, headers: res.headers, statusCode: res.status, statusText: res.statusText })),
      catchError((err) => {
        console.log('Error: ', err);
        return observableThrowError({statusCode: err.status, statusText: err.statusText, message: err.message});
      }));
  }

  /**
   * Create a FormData object from a DSpaceObject
   *
   * @param {DSpaceObject} dso
   *    the DSpaceObject
   * @return {FormData}
   *    the result
   */
  buildFormData(dso: DSpaceObject): FormData {
    const form: FormData = new FormData();
    form.append('name', dso.name);
    if (dso.metadata) {
      for (const i of Object.keys(dso.metadata)) {
        if (isNotEmpty(dso.metadata[i].value)) {
          form.append(dso.metadata[i].key, dso.metadata[i].value);
        }
      }
    }
    return form;
  }

}

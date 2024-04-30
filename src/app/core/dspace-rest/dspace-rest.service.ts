import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  throwError as observableThrowError,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import {
  hasNoValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { RequestError } from '../data/request-error.model';
import { RestRequestMethod } from '../data/rest-request-method';
import { DSpaceObject } from '../shared/dspace-object.model';
import { RawRestResponse } from './raw-rest-response.model';

export const DEFAULT_CONTENT_TYPE = 'application/json; charset=utf-8';
export interface HttpOptions {
  body?: any;
  headers?: HttpHeaders;
  params?: HttpParams;
  observe?: 'body' | 'events' | 'response';
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

/**
 * Service to access DSpace's REST API
 */
@Injectable()
export class DspaceRestService {

  constructor(protected http: HttpClient) {

  }

  /**
   * Performs a request to the REST API with the `get` http method.
   *
   * @param absoluteURL
   *      A URL
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  get(absoluteURL: string): Observable<RawRestResponse> {
    const requestOptions = {
      observe: 'response' as any,
      headers: new HttpHeaders({ 'Content-Type': DEFAULT_CONTENT_TYPE }),
    };
    return this.http.get(absoluteURL, requestOptions).pipe(
      map((res: HttpResponse<any>) => ({
        payload: res.body,
        statusCode: res.status,
        statusText: res.statusText,
      })),
      catchError((err: unknown) => observableThrowError(() => {
        console.log('Error: ', err);
        return this.handleHttpError(err);
      })),
    );
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
   * @param options
   *    the HttpOptions object
   * @param isMultipart
   *     true when this concerns a multipart request
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  request(method: RestRequestMethod, url: string, body?: any, options?: HttpOptions, isMultipart?: boolean): Observable<RawRestResponse> {
    const requestOptions: HttpOptions = {};
    requestOptions.body = body;
    if (method === RestRequestMethod.POST && isNotEmpty(body) && isNotEmpty(body.name)) {
      requestOptions.body = this.buildFormData(body);
    }
    requestOptions.observe = 'response';

    if (options && options.responseType) {
      requestOptions.responseType = options.responseType;
    }

    if (hasNoValue(options) || hasNoValue(options.headers)) {
      requestOptions.headers = new HttpHeaders();
    } else {
      requestOptions.headers = options.headers;
    }

    if (options && options.params) {
      requestOptions.params = options.params;
    }

    if (options && options.withCredentials) {
      requestOptions.withCredentials = options.withCredentials;
    }

    if (!requestOptions.headers.has('Content-Type') && !isMultipart) {
      // Because HttpHeaders is immutable, the set method returns a new object instead of updating the existing headers
      requestOptions.headers = requestOptions.headers.set('Content-Type', DEFAULT_CONTENT_TYPE);
    }
    return this.http.request(method, url, requestOptions).pipe(
      map((res) => ({
        payload: res.body,
        headers: res.headers,
        statusCode: res.status,
        statusText: res.statusText,
      })),
      catchError((err: unknown) => observableThrowError(() => {
        return this.handleHttpError(err);
      })),
    );
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
      for (const key of Object.keys(dso.metadata)) {
        for (const value of dso.allMetadataValues(key)) {
          form.append(key, value);
        }
      }
    }
    return form;
  }

  protected handleHttpError(err: unknown): unknown {
    if (err instanceof HttpErrorResponse) {
      const error = new RequestError(
        (isNotEmpty(err?.error?.message)) ? err.error.message : err.message,
      );

      error.statusCode = err.status;
      error.statusText = err.statusText;

      return error;
    } else {
      console.error('Cannot construct RequestError from', err);
      return err;
    }
  }

}

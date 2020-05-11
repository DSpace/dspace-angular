import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { isEmpty } from '../../empty.util';
import { RestRequestMethod } from '../../../core/data/rest-request-method';

import { DSpaceRESTV2Response } from '../../../core/dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Service, HttpOptions } from '../../../core/dspace-rest-v2/dspace-rest-v2.service';
import { MOCK_RESPONSE_MAP, ResponseMapMock } from './mocks/response-map.mock';
import * as URL from 'url-parse';
import { environment } from '../../../../environments/environment';

/**
 * Service to access DSpace's REST API.
 *
 * If a URL is found in this.mockResponseMap, it returns the mock response instead
 * This service can be used for mocking REST responses when developing new features
 * This is especially useful, when a REST endpoint is broken or does not exist yet
 */
@Injectable()
export class EndpointMockingRestService extends DSpaceRESTv2Service {

  constructor(
    @Inject(MOCK_RESPONSE_MAP) protected mockResponseMap: ResponseMapMock,
    protected http: HttpClient
  ) {
    super(http);
  }

  /**
   * Performs a request to the REST API with the `get` http method.
   *
   * If the URL is found in this.mockResponseMap,
   * it returns the mock response instead
   *
   * @param absoluteURL
   *      A URL
   * @return Observable<DSpaceRESTV2Response>
   *      An Observable<DSpaceRESTV2Response> containing the response
   */
  get(absoluteURL: string): Observable<DSpaceRESTV2Response> {
    const mockData = this.getMockData(absoluteURL);
    if (isEmpty(mockData)) {
      return super.get(absoluteURL);
    } else {
      return this.toMockResponse$(mockData);
    }
  }

  /**
   * Performs a request to the REST API.
   *
   * If the URL is found in this.mockResponseMap,
   * it returns the mock response instead
   *
   * @param method
   *    the HTTP method for the request
   * @param url
   *    the URL for the request
   * @param body
   *    an optional body for the request
   * @return Observable<DSpaceRESTV2Response>
   *      An Observable<DSpaceRESTV2Response> containing the response from the server
   */
  request(method: RestRequestMethod, url: string, body?: any, options?: HttpOptions, isMultipart?: boolean): Observable<DSpaceRESTV2Response> {
    const mockData = this.getMockData(url);
    if (isEmpty(mockData)) {
      return super.request(method, url, body, options, isMultipart);
    } else {
      return this.toMockResponse$(mockData);
    }
  }

  /**
   * Turn the mock object in to an Observable<DSpaceRESTV2Response>
   *
   * @param mockData
   *    the mock response
   * @return
   *    an Observable<DSpaceRESTV2Response> containing the mock response
   */
  private toMockResponse$(mockData: any): Observable<DSpaceRESTV2Response> {
    return observableOf({
      payload: mockData,
      headers: new HttpHeaders(),
      statusCode: 200,
      statusText: 'OK'
    });
  }

  /**
   * Get the mock response associated with this URL from this.mockResponseMap
   *
   * @param urlStr
   *    the URL to fetch a mock reponse for
   * @return any
   *    the mock response if there is one, undefined otherwise
   */
  private getMockData(urlStr: string): any {
    const url = new URL(urlStr);
    const key = url.pathname.slice(environment.rest.nameSpace.length);
    if (this.mockResponseMap.has(key)) {
      // parse and stringify to clone the object to ensure that any changes made
      // to it afterwards don't affect future calls
      return JSON.parse(JSON.stringify(this.mockResponseMap.get(key)));
    } else {
      return undefined;
    }
  }
}

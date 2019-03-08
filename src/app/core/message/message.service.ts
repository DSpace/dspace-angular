import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { merge as observableMerge, Observable, of as observableOf } from 'rxjs';
import { catchError, distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import { MessageGetRequest, MessagePostRequest, PostRequest, RestRequest } from '../data/request.models';
import { DSpaceRESTv2Service, HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { MessageDataResponse } from './message-data-response';
import { RemoteDataError } from '../data/remote-data-error';
import { getResponseFromEntry } from '../shared/operators';
import { ErrorResponse, MessageResponse, RestResponse } from '../cache/response.models';
import { RestRequestMethod } from '../data/rest-request-method';

@Injectable()
export class MessageService {
  protected linkPath = 'messages';

  constructor(protected http: DSpaceRESTv2Service,
              protected requestService: RequestService,
              protected halService: HALEndpointService) {
  }

  protected fetchRequest(requestId: string): Observable<MessageDataResponse> {
    const responses = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
    const errorResponses = responses.pipe(
      filter((response: RestResponse) => !response.isSuccessful),
      mergeMap((response: ErrorResponse) => observableOf(
        new MessageDataResponse(
          response.isSuccessful,
          new RemoteDataError(response.statusCode, response.statusText, response.errorMessage)
      ))
    ));
    const successResponses = responses.pipe(
      filter((response: RestResponse) => response.isSuccessful),
      map((response: MessageResponse) =>  new MessageDataResponse(response.isSuccessful)),
      distinctUntilChanged()
    );
    return observableMerge(errorResponses, successResponses);
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  public postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new MessagePostRequest(requestId, endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap((request: PostRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpointURL: string) => this.getEndpointByMethod(endpointURL, method)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new MessageGetRequest(requestId, endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request, true)),
      flatMap((request: RestRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public createMessage(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('', this.requestService.prepareBody(body), this.makeHttpOptions());
  }

  public markAsRead(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('read', this.requestService.prepareBody(body), this.makeHttpOptions());
  }

  public markAsUnread(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('unread', this.requestService.prepareBody(body), this.makeHttpOptions());
  }

  protected makeHttpOptions() {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return options;
  }

  public getMessageContent(url: string): Observable<any> {
    if (isNotEmpty(url)) {
      const options: HttpOptions = Object.create({});
      options.observe = 'response';
      options.responseType = 'text';
      return this.http.request(RestRequestMethod.GET, url, null, options).pipe(
        map((res) => ({ payload: res.payload })),
        catchError((err) => observableOf({ payload: '' })));
    } else {
      return observableOf({ payload: '' });
    }
  }
}

import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { Observable } from 'rxjs/Observable';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import {
  AuthGetRequest, AuthPostRequest, GetRequest, MessageGetRequest, MessagePostRequest, PostRequest,
  RestRequest, RestRequestMethod
} from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ErrorResponse, MessageResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTv2Service, HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpHeaders } from '@angular/common/http';
import { MessageDataResponse } from './message-data-response';
import { RemoteDataError } from '../data/remote-data-error';

@Injectable()
export class MessageService {
  protected linkPath = 'messages';
  protected browseEndpoint = '';

  constructor(protected http: DSpaceRESTv2Service,
              protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              protected halService: HALEndpointService) {
  }

  protected fetchRequest(request: RestRequest): Observable<MessageDataResponse> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) => {
        return Observable.of(new MessageDataResponse(response.isSuccessful, new RemoteDataError(response.statusCode, response.errorMessage)))
      }),
      successResponse
        .map((response: MessageResponse) => new MessageDataResponse(response.isSuccessful))
        .distinctUntilChanged());
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  protected postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.halService.getEndpoint(this.linkPath)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new MessagePostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(this.linkPath)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new MessageGetRequest(this.requestService.generateRequestId(), endpointURL, options))
      .do((request: GetRequest) => this.requestService.configure(request, true))
      .flatMap((request: GetRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public createMessage(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('', this.halService.prepareBody(body), this.makeHttpOptions());
  }

  public markAsRead(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('read', this.halService.prepareBody(body), this.makeHttpOptions());
  }

  public markAsUnread(body: any, options?: HttpOptions): Observable<MessageDataResponse> {
    return this.postToEndpoint('unread', this.halService.prepareBody(body), this.makeHttpOptions());
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
      return this.http.request(RestRequestMethod.Get, url, null, options)
        .map((res) => ({ payload: res.payload }))
        .catch((err) => Observable.of({ payload: '' }));
    } else {
      return Observable.of({ payload: '' });
    }
  }
}

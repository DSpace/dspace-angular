import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { Observable } from 'rxjs/Observable';
import { isNotEmpty } from '../../shared/empty.util';
import {
  AuthGetRequest, AuthPostRequest, GetRequest, MessageGetRequest, MessagePostRequest, PostRequest,
  RestRequest
} from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { AuthSuccessResponse, ErrorResponse, MessageResponse, RestResponse } from '../cache/response-cache.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

@Injectable()
export class MessageService extends HALEndpointService {
  protected linkName = 'messages';
  protected browseEndpoint = '';

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
    super();
  }

  protected fetchRequest(request: RestRequest): Observable<any> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(response.errorMessage))),
      successResponse
        .filter((response: MessageResponse) => isNotEmpty(response))
        .map((response: MessageResponse) => response.response)
        .distinctUntilChanged());
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  protected postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<any> {
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new MessagePostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new MessageGetRequest(this.requestService.generateRequestId(), endpointURL, options))
      .do((request: GetRequest) => this.requestService.configure(request, true))
      .flatMap((request: GetRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public createMessage(body: any, options?: HttpOptions): Observable<any> {
    return this.postToEndpoint('', body, options);
  }

  public markAsRead(body: any, options?: HttpOptions): Observable<any> {
    return this.postToEndpoint('read', body, options);
  }

  public markAsUnread(body: any, options?: HttpOptions): Observable<any> {
    return this.postToEndpoint('unread', body, options);
  }
}

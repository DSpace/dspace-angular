import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { Observable } from 'rxjs/Observable';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthGetRequest, AuthPostRequest, PostRequest, RestRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { AuthStatusResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

@Injectable()
export class AuthRequestService extends HALEndpointService {
  protected linkName = 'authn';
  protected browseEndpoint = '';

  /**
   * True if authenticated
   * @type
   */
  private _authenticated = false;

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
        .filter((response: AuthStatusResponse) => isNotEmpty(response))
        .map((response: AuthStatusResponse) => response.response)
        .distinctUntilChanged());
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  public postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<any> {
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new AuthPostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL) => this.getEndpointByMethod(endpointURL, method))
      .distinctUntilChanged()
      .map((endpointURL: string) => new AuthGetRequest(this.requestService.generateRequestId(), endpointURL, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }
}

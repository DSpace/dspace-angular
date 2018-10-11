import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthGetRequest, AuthPostRequest, PostRequest, RestRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { AuthStatusResponse, ErrorResponse } from '../cache/response-cache.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

@Injectable()
export class AuthRequestService {
  protected linkName = 'authn';
  protected browseEndpoint = '';

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected halService: HALEndpointService,
              protected responseCache: ResponseCacheService,
              protected requestService: RequestService) {
  }

  protected fetchRequest(request: RestRequest): Observable<any> {
    return this.responseCache.get(request.href).pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      // TODO to review when https://github.com/DSpace/dspace-angular/issues/217 will be fixed
      tap(() => this.responseCache.remove(request.href)),
      mergeMap((response) => {
        if (response.isSuccessful && isNotEmpty(response)) {
            return observableOf((response as AuthStatusResponse).response);
        } else if (!response.isSuccessful) {
          return observableThrowError(new Error((response as ErrorResponse).errorMessage));
        }
      })
    );
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  public postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new AuthPostRequest(this.requestService.generateRequestId(), endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request, true)),
      mergeMap((request: PostRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new AuthGetRequest(this.requestService.generateRequestId(), endpointURL, options)),
      tap((request: PostRequest) => this.requestService.configure(request, true)),
      mergeMap((request: PostRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }
}

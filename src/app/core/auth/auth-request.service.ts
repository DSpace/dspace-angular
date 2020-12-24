import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import {
  GetRequest,
  PostRequest,
  RestRequest,
} from '../data/request.models';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { AuthStatus } from './models/auth-status.model';
import { ShortLivedToken } from './models/short-lived-token.model';
import { URLCombiner } from '../url-combiner/url-combiner';

@Injectable()
export class AuthRequestService {
  protected linkName = 'authn';
  protected browseEndpoint = '';
  protected shortlivedtokensEndpoint = 'shortlivedtokens';

  constructor(protected halService: HALEndpointService,
              protected requestService: RequestService,
              private rdbService: RemoteDataBuildService
              ) {
  }

  protected fetchRequest(request: RestRequest): Observable<RemoteData<AuthStatus>> {
    return this.rdbService.buildFromRequestUUID<AuthStatus>(request.uuid).pipe(
      getFirstCompletedRemoteData(),
    );
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  public postToEndpoint(method: string, body?: any, options?: HttpOptions): Observable<RemoteData<AuthStatus>> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL, body, options)),
      map ((request: PostRequest) => {
        request.responseMsToLive = 10 * 1000;
        return request;
      }),
      tap((request: PostRequest) => this.requestService.configure(request)),
      mergeMap((request: PostRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  public getRequest(method: string, options?: HttpOptions): Observable<RemoteData<AuthStatus>> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new GetRequest(this.requestService.generateRequestId(), endpointURL, undefined, options)),
      map ((request: GetRequest) => {
        request.forceBypassCache = true;
        return request;
      }),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  /**
   * Send a POST request to retrieve a short-lived token which provides download access of restricted files
   */
  public getShortlivedToken(): Observable<string> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((href: string) => new URLCombiner(href, this.shortlivedtokensEndpoint).toString()),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      switchMap((request: PostRequest) => this.rdbService.buildFromRequestUUID<ShortLivedToken>(request.uuid)),
      getFirstCompletedRemoteData(),
      map((response: RemoteData<ShortLivedToken>) => {
        if (response.hasSucceeded) {
          return response.payload.value;
        } else {
          return null;
        }
      })
    );
  }
}

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import { GetRequest, PostRequest, RestRequest, } from '../data/request.models';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { AuthStatus } from './models/auth-status.model';
import { ShortLivedToken } from './models/short-lived-token.model';
import { URLCombiner } from '../url-combiner/url-combiner';

/**
 * Abstract service to send authentication requests
 */
export abstract class AuthRequestService {
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
      tap((request: PostRequest) => this.requestService.send(request)),
      mergeMap((request: PostRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  public getRequest(method: string, options?: HttpOptions): Observable<RemoteData<AuthStatus>> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new GetRequest(this.requestService.generateRequestId(), endpointURL, undefined, options)),
      tap((request: GetRequest) => this.requestService.send(request)),
      mergeMap((request: GetRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  /**
   * Factory function to create the request object to send. This needs to be a POST client side and
   * a GET server side. Due to CSRF validation, the server isn't allowed to send a POST, so we allow
   * only the server IP to send a GET to this endpoint.
   *
   * @param href The href to send the request to
   * @protected
   */
  protected abstract createShortLivedTokenRequest(href: string): GetRequest | PostRequest;

  /**
   * Send a request to retrieve a short-lived token which provides download access of restricted files
   */
  public getShortlivedToken(): Observable<string> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((href: string) => new URLCombiner(href, this.shortlivedtokensEndpoint).toString()),
      map((endpointURL: string) => this.createShortLivedTokenRequest(endpointURL)),
      tap((request: RestRequest) => this.requestService.send(request)),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID<ShortLivedToken>(request.uuid)),
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

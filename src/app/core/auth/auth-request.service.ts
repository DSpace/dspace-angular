import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthGetRequest, AuthPostRequest, GetRequest, PostRequest, RestRequest } from '../data/request.models';
import { AuthStatusResponse, ErrorResponse } from '../cache/response.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { getResponseFromEntry } from '../shared/operators';

@Injectable()
export class AuthRequestService {
  protected linkName = 'authn';
  protected browseEndpoint = '';

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected halService: HALEndpointService,
              protected requestService: RequestService) {
  }

  protected fetchRequest(request: RestRequest): Observable<any> {
    return this.requestService.getByUUID(request.uuid).pipe(
      getResponseFromEntry(),
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
      map ((request: PostRequest) => {
        request.responseMsToLive = 10 * 1000;
        return request;
      }),
      tap((request: PostRequest) => this.requestService.configure(request)),
      mergeMap((request: PostRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(this.linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL) => this.getEndpointByMethod(endpointURL, method)),
      distinctUntilChanged(),
      map((endpointURL: string) => new AuthGetRequest(this.requestService.generateRequestId(), endpointURL, options)),
      map ((request: GetRequest) => {
        request.responseMsToLive = 10 * 1000;
        return request;
      }),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }
}

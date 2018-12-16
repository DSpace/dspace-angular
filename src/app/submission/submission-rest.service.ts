import { Injectable } from '@angular/core';

import { merge as observableMerge, Observable, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ResponseCacheService } from '../core/cache/response-cache.service';
import { RequestService } from '../core/data/request.service';
import { ResponseCacheEntry } from '../core/cache/response-cache.reducer';
import { SubmissionSuccessResponse } from '../core/cache/response-cache.models';
import { isNotEmpty } from '../shared/empty.util';
import {
  ConfigRequest,
  DeleteRequest,
  PostRequest,
  RestRequest,
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest
} from '../core/data/request.models';
import { SubmitDataResponseDefinitionObject } from '../core/shared/submit-data-response-definition.model';
import { CoreState } from '../core/core.reducers';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';

@Injectable()
export class SubmissionRestService {
  protected linkPath = 'workspaceitems';

  constructor(
    protected rdbService: RemoteDataBuildService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {
  }

  protected submitData(request: RestRequest): Observable<SubmitDataResponseDefinitionObject> {
    const responses = this.responseCache.get(request.href).pipe(map((entry: ResponseCacheEntry) => entry.response));
    const errorResponses = responses.pipe(
      filter((response: SubmissionSuccessResponse) => !response.isSuccessful),
      mergeMap(() => observableThrowError(new Error(`Couldn't send data to server`)))
    );
    const successResponses = responses.pipe(
      filter((response: SubmissionSuccessResponse) => response.isSuccessful),
      map((response: SubmissionSuccessResponse) => response.dataDefinition as any),
      distinctUntilChanged()
    );
    return observableMerge(errorResponses, successResponses);
/*    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        observableThrowError(new Error(`Couldn't send data to server`))),
      successResponse
        .filter((response: SubmissionSuccessResponse) => isNotEmpty(response))
        .map((response: SubmissionSuccessResponse) => response.dataDefinition)
        .distinctUntilChanged());*/
  }

  protected fetchRequest(request: RestRequest): Observable<SubmitDataResponseDefinitionObject> {
    const responses = this.responseCache.get(request.href).pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      tap(() => this.responseCache.remove(request.href)));
    const errorResponses = responses.pipe(
      filter((response: SubmissionSuccessResponse) => !response.isSuccessful),
      mergeMap(() => observableThrowError(new Error(`Couldn't retrieve the data`)))
    );
    const successResponses = responses.pipe(
      filter((response: SubmissionSuccessResponse) => response.isSuccessful && isNotEmpty(response)),
      map((response: SubmissionSuccessResponse) => response.dataDefinition as any),
      distinctUntilChanged()
    );
    return observableMerge(errorResponses, successResponses);

/*    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        observableThrowError(new Error(`Couldn't retrieve the data`))),
      successResponse
        .filter((response: SubmissionSuccessResponse) => isNotEmpty(response))
        .map((response: SubmissionSuccessResponse) => response.dataDefinition)
        .distinctUntilChanged());*/
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  public deleteById(scopeId: string, linkName?: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName || this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      map((endpointURL: string) => new SubmissionDeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: DeleteRequest) => this.requestService.configure(request)),
      flatMap((request: DeleteRequest) => this.submitData(request)),
      distinctUntilChanged());
  }

  public getDataByHref(href: string, options?: HttpOptions): Observable<any> {
    const request = new ConfigRequest(this.requestService.generateRequestId(), href, options);
    this.requestService.configure(request, true);

    return this.fetchRequest(request);
  }

  public getDataById(linkName: string, id: string): Observable<any> {
    return this.halService.getEndpoint(linkName).pipe(
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, id)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request, true)),
      flatMap((request: RestRequest) => this.fetchRequest(request)),
      distinctUntilChanged());
  }

  public postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPostRequest(this.requestService.generateRequestId(), endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request, true)),
      flatMap((request: PostRequest) => this.submitData(request)),
      distinctUntilChanged());
  }

  public patchToEndpoint(linkName: string, body: any, scopeId?: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPatchRequest(this.requestService.generateRequestId(), endpointURL, body)),
      tap((request: PostRequest) => this.requestService.configure(request, true)),
      flatMap((request: PostRequest) => this.submitData(request)),
      distinctUntilChanged());
  }

}

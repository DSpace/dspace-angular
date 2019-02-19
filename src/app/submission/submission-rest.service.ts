import { Injectable } from '@angular/core';

import { merge as observableMerge, Observable, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';

import { RequestService } from '../core/data/request.service';
import { isNotEmpty } from '../shared/empty.util';
import {
  DeleteRequest,
  PostRequest,
  RestRequest,
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest
} from '../core/data/request.models';
import { SubmitDataResponseDefinitionObject } from '../core/shared/submit-data-response-definition.model';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';
import { ErrorResponse, RestResponse, SubmissionSuccessResponse } from '../core/cache/response.models';
import { getResponseFromEntry } from '../core/shared/operators';

@Injectable()
export class SubmissionRestService {
  protected linkPath = 'workspaceitems';

  constructor(
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
  }

  protected fetchRequest(requestId: string): Observable<SubmitDataResponseDefinitionObject> {
    const responses = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
    const errorResponses = responses.pipe(
      filter((response: RestResponse) => !response.isSuccessful),
      mergeMap((error: ErrorResponse) => observableThrowError(error))
    );
    const successResponses = responses.pipe(
      filter((response: RestResponse) => response.isSuccessful),
      map((response: SubmissionSuccessResponse) => response.dataDefinition as any),
      distinctUntilChanged()
    );
    return observableMerge(errorResponses, successResponses);
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  public deleteById(scopeId: string, linkName?: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName || this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      map((endpointURL: string) => new SubmissionDeleteRequest(requestId, endpointURL)),
      tap((request: DeleteRequest) => this.requestService.configure(request)),
      flatMap((request: DeleteRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public getDataById(linkName: string, id: string): Observable<any> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, id)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionRequest(requestId, endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request, true)),
      flatMap((request: RestRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPostRequest(requestId, endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap((request: PostRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public patchToEndpoint(linkName: string, body: any, scopeId?: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPatchRequest(requestId, endpointURL, body)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap((request: PostRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

}

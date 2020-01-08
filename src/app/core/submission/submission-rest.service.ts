import { Injectable } from '@angular/core';

import { merge as observableMerge, Observable, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';

import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import {
  DeleteRequest, GetRequest,
  PostRequest,
  RestRequest,
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest
} from '../data/request.models';
import { SubmitDataResponseDefinitionObject } from '../shared/submit-data-response-definition.model';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ErrorResponse, RestResponse, SubmissionSuccessResponse } from '../cache/response.models';
import { getResponseFromEntry } from '../shared/operators';
import {URLCombiner} from '../url-combiner/url-combiner';

/**
 * The service handling all submission REST requests
 */
@Injectable()
export class SubmissionRestService {
  protected linkPath = 'workspaceitems';

  constructor(
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
  }

  /**
   * Fetch a RestRequest
   *
   * @param requestId
   *    The base endpoint for the type of object
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
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

  /**
   * Create the HREF for a specific submission object based on its identifier
   *
   * @param endpoint
   *    The base endpoint for the type of object
   * @param resourceID
   *    The identifier for the object
   * @param collectionId
   *    The owning collection for the object
   */
  protected getEndpointByIDHref(endpoint, resourceID, collectionId?: string): string {
    let url = isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
    if (collectionId) {
      url = new URLCombiner(url, '?owningCollection=' + collectionId).toString();
    }
    return url;
  }

  /**
   * Delete an existing submission Object on the server
   *
   * @param scopeId
   *    The submission Object to be removed
   * @param linkName
   *    The endpoint link name
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public deleteById(scopeId: string, linkName?: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName || this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      map((endpointURL: string) => new SubmissionDeleteRequest(requestId, endpointURL)),
      tap((request: DeleteRequest) => this.requestService.configure(request)),
      flatMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Return an existing submission Object from the server
   *
   * @param linkName
   *    The endpoint link name
   * @param id
   *    The submission Object to retrieve
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public getDataById(linkName: string, id: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, id)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionRequest(requestId, endpointURL)),
      tap((request: RestRequest) => {
        this.requestService.removeByHrefSubstring(request.href);
        this.requestService.configure(request);
      }),
      flatMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Make a new post request
   *
   * @param linkName
   *    The endpoint link name
   * @param body
   *    The post request body
   * @param scopeId
   *    The submission Object id
   * @param options
   *    The [HttpOptions] object
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   * @param collectionId
   *    The owning collection id
   */
  public postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions, collectionId?: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId, collectionId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPostRequest(requestId, endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Make a new patch to a specified object
   *
   * @param linkName
   *    The endpoint link name
   * @param body
   *    The post request body
   * @param scopeId
   *    The submission Object id
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public patchToEndpoint(linkName: string, body: any, scopeId?: string): Observable<SubmitDataResponseDefinitionObject> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new SubmissionPatchRequest(requestId, endpointURL, body)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

}

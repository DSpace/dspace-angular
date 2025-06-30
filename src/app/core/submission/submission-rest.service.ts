import { Injectable } from '@angular/core';
import {
  Observable,
  skipWhile,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';

import {
  hasValue,
  hasValueOperator,
  isNotEmpty,
} from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ErrorResponse } from '../cache/response.models';
import { RemoteData } from '../data/remote-data';
import {
  DeleteRequest,
  PostRequest,
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest,
} from '../data/request.models';
import { RequestService } from '../data/request.service';
import { RequestError } from '../data/request-error.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { SubmitDataResponseDefinitionObject } from '../shared/submit-data-response-definition.model';
import { URLCombiner } from '../url-combiner/url-combiner';
import { SubmissionResponse } from './submission-response.model';

/**
 * Retrieve the first emitting payload's dataDefinition, or throw an error if the request failed
 */
export const getFirstDataDefinition = () =>
  (source: Observable<RemoteData<SubmissionResponse>>): Observable<SubmitDataResponseDefinitionObject> =>
    source.pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<SubmissionResponse>) => {
        if (response.hasFailed) {
          throw new ErrorResponse({ statusText: response.errorMessage, statusCode: response.statusCode } as RequestError);
        } else {
          return hasValue(response?.payload?.dataDefinition) ? response.payload.dataDefinition : [response.payload];
        }
      }),
      distinctUntilChanged(),
    );

/**
 * The service handling all submission REST requests
 */
@Injectable({ providedIn: 'root' })
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
    return this.rdbService.buildFromRequestUUID<SubmissionResponse>(requestId).pipe(
      getFirstDataDefinition(),
    );
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
    url = new URLCombiner(url, '?embed=item,sections,collection').toString();
    if (collectionId) {
      url = new URLCombiner(url, `&owningCollection=${collectionId}`).toString();
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
      tap((request: DeleteRequest) => this.requestService.send(request)),
      mergeMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Return an existing submission Object from the server
   *
   * @param linkName
   *    The endpoint link name
   * @param id
   *    The submission Object to retrieve
   * @param useCachedVersionIfAvailable
   *    If this is true, the request will only be sent if there's no valid & cached version. Defaults to false
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public getDataById(linkName: string, id: string, useCachedVersionIfAvailable = false): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName).pipe(
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, id)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      mergeMap((endpointURL: string) => {
        this.sendGetDataRequest(endpointURL, useCachedVersionIfAvailable);
        const startTime: number = new Date().getTime();
        return this.requestService.getByHref(endpointURL).pipe(
          map((requestEntry) => requestEntry?.request?.uuid),
          hasValueOperator(),
          distinctUntilChanged(),
          switchMap((requestId) => this.rdbService.buildFromRequestUUID<SubmissionResponse>(requestId)),
          // This skip ensures that if a stale object is present in the cache when you do a
          // call it isn't immediately returned, but we wait until the remote data for the new request
          // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
          // cached completed object
          skipWhile((rd: RemoteData<SubmissionResponse>) => rd.isStale || (!useCachedVersionIfAvailable && rd.lastUpdated < startTime)),
          tap((rd: RemoteData<SubmissionResponse>) => {
            if (hasValue(rd) && rd.isStale) {
              this.sendGetDataRequest(endpointURL, useCachedVersionIfAvailable);
            }
          }),
        );
      }),
      getFirstDataDefinition(),
    );
  }

  /**
   * Send a GET SubmissionRequest
   *
   * @param href
   *    Endpoint URL of the submission data
   * @param useCachedVersionIfAvailable
   *    If this is true, the request will only be sent if there's no valid & cached version. Defaults to false
   */
  private sendGetDataRequest(href: string, useCachedVersionIfAvailable = false) {
    const requestId = this.requestService.generateRequestId();
    const request = new SubmissionRequest(requestId, href);
    this.requestService.send(request, useCachedVersionIfAvailable);
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
      tap((request: PostRequest) => this.requestService.send(request)),
      mergeMap(() => this.fetchRequest(requestId)),
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
      tap((request: PostRequest) => this.requestService.send(request)),
      mergeMap(() => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

}

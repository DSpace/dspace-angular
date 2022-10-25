import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, map, mergeMap, tap } from 'rxjs/operators';

import { DataService } from '../data/data.service';
import {
  DeleteRequest,
  PostRequest,
  TaskDeleteRequest,
  TaskPostRequest
} from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { ProcessTaskResponse } from './models/process-task-response';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from '../shared/operators';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { CacheableObject } from '../cache/cacheable-object.model';
import { FindListOptions } from '../data/find-list-options.model';

/**
 * An abstract class that provides methods to handle task requests.
 */
export abstract class TasksService<T extends CacheableObject> extends DataService<T> {

  /**
   * Create the HREF for a specific submission object based on its identifier
   *
   * @param endpoint
   *    The base endpoint for the type of object
   * @param resourceID
   *    The identifier for the object
   */
  getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  /**
   * Make a new post request
   *
   * @param linkPath
   *    The endpoint link name
   * @param body
   *    The request body
   * @param scopeId
   *    The task id to be removed
   * @param options
   *    The HttpOptions object
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public postToEndpoint(linkPath: string, body: any, scopeId?: string, options?: HttpOptions): Observable<ProcessTaskResponse> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new TaskPostRequest(requestId, endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.send(request)),
      mergeMap((request: PostRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Delete an existing task on the server
   *
   * @param linkPath
   *    The endpoint link name
   * @param scopeId
   *    The task id to be removed
   * @param options
   *    The HttpOptions object
   * @return Observable<SubmitDataResponseDefinitionObject>
   *     server response
   */
  public deleteById(linkPath: string, scopeId: string, options?: HttpOptions): Observable<ProcessTaskResponse> {
    const requestId = this.requestService.generateRequestId();
    return this.getEndpointById(scopeId, linkPath).pipe(
      map((endpointURL: string) => new TaskDeleteRequest(requestId, endpointURL, null, options)),
      tap((request: DeleteRequest) => this.requestService.send(request)),
      mergeMap((request: DeleteRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  /**
   * Get the endpoint of a task by scopeId.
   * @param linkPath
   * @param scopeId
   */
  public getEndpointById(scopeId: string, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(linkPath || this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)));
  }

  /**
   * Search a task.
   * @param searchMethod
   *   the search method
   * @param options
   *   the find list options
   * @param linksToFollow
   *   links to follow
   */
  public searchTask(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    const hrefObs = this.getSearchByHref(searchMethod, options, ...linksToFollow);
    return hrefObs.pipe(
      find((href: string) => hasValue(href)),
      mergeMap((href) => this.findByHref(href, false, true).pipe(
        getAllCompletedRemoteData(),
        tap(() => this.requestService.setStaleByHrefSubstring(href)))
      )
    );
  }

  /**
   * Fetch a RestRequest
   *
   * @param requestId
   *    The base endpoint for the type of object
   * @return Observable<ProcessTaskResponse>
   *     server response
   */
  protected fetchRequest(requestId: string): Observable<ProcessTaskResponse> {
    return this.rdbService.buildFromRequestUUID(requestId).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<any>) => {
        if (response.hasFailed) {
          return new ProcessTaskResponse(false, response.statusCode, response.errorMessage);
        } else {
          return new ProcessTaskResponse(true, response.statusCode);
        }
      })
    );
  }

  /**
   * Create a new HttpOptions
   */
  protected makeHttpOptions() {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return options;
  }
}

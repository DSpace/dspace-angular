import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FindListOptions } from '../data/find-list-options.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstSucceededRemoteData } from '../shared/operators';
import { ClaimedTask } from './models/claimed-task-object.model';
import { ProcessTaskResponse } from './models/process-task-response';
import { TasksService } from './tasks.service';

/**
 * The service handling all REST requests for ClaimedTask
 */
@Injectable({ providedIn: 'root' })
export class ClaimedTaskDataService extends TasksService<ClaimedTask> {

  /**
   * Initialize instance variables
   *
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('claimedtasks', requestService, rdbService, objectCache, halService, 1000);
  }

  /**
   * Make a request to claim the given task
   *
   * @param scopeId
   *    The task id
   * @param poolTaskHref
   *    The pool task Href
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public claimTask(scopeId: string, poolTaskHref: string): Observable<ProcessTaskResponse> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.postToEndpoint(this.linkPath, poolTaskHref, null, options);
  }

  /**
   * Make a request for the given task
   *
   * @param scopeId
   *    The task id
   * @param body
   *    The request body
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public submitTask(scopeId: string, body: any): Observable<ProcessTaskResponse> {
    return this.postToEndpoint(this.linkPath, this.requestService.uriEncodeBody(body), scopeId, this.makeHttpOptions());
  }

  /**
   * Make a request to return the given task to the pool
   *
   * @param scopeId
   *    The task id
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public returnToPoolTask(scopeId: string): Observable<ProcessTaskResponse> {
    return this.deleteById(this.linkPath, scopeId, this.makeHttpOptions());
  }

  /**
   * Search a claimed task by item uuid.
   * @param uuid
   *   The item uuid
   * @return {Observable<RemoteData<ClaimedTask>>}
   *    The server response
   */
  public findByItem(uuid: string): Observable<RemoteData<ClaimedTask>> {
    const options = new FindListOptions();
    options.searchParams = [
      new RequestParam('uuid', uuid),
    ];
    return this.searchTask('findByItem', options).pipe(getFirstSucceededRemoteData());
  }

}

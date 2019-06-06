import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { RequestService } from '../data/request.service';
import { ClaimedTask } from './models/claimed-task-object.model';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { ProcessTaskResponse } from './models/process-task-response';

/**
 * The service handling all REST requests for ClaimedTask
 */
@Injectable()
export class ClaimedTaskDataService extends TasksService<ClaimedTask> {

  /**
   * The endpoint link name
   */
  protected linkPath = 'claimedtasks';

  /**
   * When true, a new request is always dispatched
   */
  protected forceBypassCache = true;

  /**
   * Initialize instance variables
   *
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {NormalizedObjectBuildService} dataBuildService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {DSOChangeAnalyzer<ClaimedTask} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<ClaimedTask>) {
    super();
  }

  /**
   * Make a request to approve the given task
   *
   * @param scopeId
   *    The task id
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public approveTask(scopeId: string): Observable<ProcessTaskResponse> {
    const body = {
      submit_approve: 'true'
    };
    return this.postToEndpoint(this.linkPath, this.requestService.uriEncodeBody(body), scopeId, this.makeHttpOptions());
  }

  /**
   * Make a request to reject the given task
   *
   * @param reason
   *    The reason of reject
   * @param scopeId
   *    The task id
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public rejectTask(reason: string, scopeId: string): Observable<ProcessTaskResponse> {
    const body = {
      submit_reject: 'true',
      reason
    };
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

}

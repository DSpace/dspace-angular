import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ClaimedTask } from './models/claimed-task-object.model';
import { CLAIMED_TASK } from './models/claimed-task-object.resource-type';
import { ProcessTaskResponse } from './models/process-task-response';
import { TasksService } from './tasks.service';

/**
 * The service handling all REST requests for ClaimedTask
 */
@Injectable()
@dataService(CLAIMED_TASK)
export class ClaimedTaskDataService extends TasksService<ClaimedTask> {

  protected responseMsToLive = 10 * 1000;

  /**
   * The endpoint link name
   */
  protected linkPath = 'claimedtasks';

  /**
   * Initialize instance variables
   *
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
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
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<ClaimedTask>) {
    super();
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

}

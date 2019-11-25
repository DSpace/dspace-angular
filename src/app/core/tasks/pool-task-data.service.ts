import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { RequestService } from '../data/request.service';
import { PoolTask } from './models/pool-task-object.model';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { ProcessTaskResponse } from './models/process-task-response';

/**
 * The service handling all REST requests for PoolTask
 */
@Injectable()
export class PoolTaskDataService extends TasksService<PoolTask> {

  /**
   * The endpoint link name
   */
  protected linkPath = 'pooltasks';

  protected responseMsToLive = 10 * 1000;

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
    protected comparator: DSOChangeAnalyzer<PoolTask>) {
    super();
  }

  /**
   * Make a request to claim the given task
   *
   * @param scopeId
   *    The task id
   * @return {Observable<ProcessTaskResponse>}
   *    Emit the server response
   */
  public claimTask(scopeId: string): Observable<ProcessTaskResponse> {
    return this.postToEndpoint(this.linkPath, {}, scopeId, this.makeHttpOptions());
  }
}

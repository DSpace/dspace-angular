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
import { PoolTask } from './models/pool-task-object.model';
import { POOL_TASK } from './models/pool-task-object.resource-type';
import { TasksService } from './tasks.service';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';
import { getFirstCompletedRemoteData } from '../shared/operators';

/**
 * The service handling all REST requests for PoolTask
 */
@Injectable()
@dataService(POOL_TASK)
export class PoolTaskDataService extends TasksService<PoolTask> {

  /**
   * The endpoint link name
   */
  protected linkPath = 'pooltasks';

  protected responseMsToLive = 1000;

  /**
   * Initialize instance variables
   *
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {NormalizedObjectBuildService} linkService
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
    protected comparator: DSOChangeAnalyzer<PoolTask>) {
    super();
  }

  /**
   * Search a pool task by item uuid.
   * @param uuid
   *   The item uuid
   * @return {Observable<RemoteData<ClaimedTask>>}
   *    The server response
   */
  public findByItem(uuid: string): Observable<RemoteData<PoolTask>> {
    const options = new FindListOptions();
    options.searchParams = [
      new RequestParam('uuid', uuid)
    ];
    return this.searchTask('findByItem', options).pipe(getFirstCompletedRemoteData());
  }

  /**
   * Get the Href of the pool task
   *
   * @param poolTaskId
   *   the poolTask id
   * @return {Observable<string>>}
   *    the Href
   */
  public getPoolTaskEndpointById(poolTaskId): Observable<string> {
    return this.getEndpointById(poolTaskId);
  }

}

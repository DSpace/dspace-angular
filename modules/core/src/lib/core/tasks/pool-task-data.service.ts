import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache';
import { RequestParam } from '../cache';
import { ObjectCacheService } from '../cache';
import { FindListOptions } from '../data';
import { RemoteData } from '../data';
import { RequestService } from '../data';
import { HALEndpointService } from '../shared';
import { getFirstCompletedRemoteData } from '../shared';
import { PoolTask } from './models';
import { TasksService } from './tasks.service';

/**
 * The service handling all REST requests for PoolTask
 */
@Injectable({ providedIn: 'root' })
export class PoolTaskDataService extends TasksService<PoolTask> {
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
    super('pooltasks', requestService, rdbService, objectCache, halService, 1000);
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
      new RequestParam('uuid', uuid),
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

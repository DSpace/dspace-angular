import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { RequestService } from '../data/request.service';
import { NormalizedPoolTask } from './models/normalized-pool-task-object.model';
import { PoolTask } from './models/pool-task-object.model';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class PoolTaskDataService extends TasksService<NormalizedPoolTask, PoolTask> {
  protected linkPath = 'pooltasks';
  protected overrideRequest = true;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {
    super();
  }

  public claimTask(scopeId: string): Observable<any> {
    return this.postToEndpoint(this.linkPath, {}, scopeId, this.makeHttpOptions());
  }
}

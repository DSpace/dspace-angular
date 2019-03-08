import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { RequestService } from '../data/request.service';
import { NormalizedPoolTask } from './models/normalized-pool-task-object.model';
import { PoolTask } from './models/pool-task-object.model';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';

@Injectable()
export class PoolTaskDataService extends TasksService<NormalizedPoolTask, PoolTask> {
  protected linkPath = 'pooltasks';
  protected forceBypassCache = true;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer) {
    super();
  }

  public claimTask(scopeId: string): Observable<any> {
    return this.postToEndpoint(this.linkPath, {}, scopeId, this.makeHttpOptions());
  }
}

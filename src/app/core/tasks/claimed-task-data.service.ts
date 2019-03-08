import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { RequestService } from '../data/request.service';
import { NormalizedClaimedTask } from './models/normalized-claimed-task-object.model';
import { ClaimedTask } from './models/claimed-task-object.model';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';

@Injectable()
export class ClaimedTaskDataService extends TasksService<NormalizedClaimedTask, ClaimedTask> {
  protected linkPath = 'claimedtasks';
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

  public approveTask(scopeId: string): Observable<any> {
    const body = {
      submit_approve: 'true'
    };
    return this.postToEndpoint(this.linkPath, this.requestService.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public rejectTask(reason: string, scopeId: string): Observable<any> {
    const body = {
      submit_reject: 'true',
      reason
    };
    return this.postToEndpoint(this.linkPath, this.requestService.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public returnToPoolTask(scopeId: string): Observable<any> {
    return this.deleteById(this.linkPath, scopeId, this.makeHttpOptions());
  }

}

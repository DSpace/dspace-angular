import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';

import { RequestService } from '../data/request.service';
import { NormalizedClaimedTask } from './models/normalized-claimed-task-object.model';
import { ClaimedTask } from './models/claimed-task-object.model';
import { isNotEmpty } from '../../shared/empty.util';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class ClaimedTaskDataService extends TasksService<NormalizedClaimedTask, ClaimedTask> {
  protected linkPath = 'claimedtasks';
  protected overrideRequest = true;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {
    super();
  }

  public approveTask(scopeId: string): Observable<any> {
    const body = {
      submit_approve: 'true'
    };
    return this.postToEndpoint(this.linkPath, this.halService.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public rejectTask(reason: string, scopeId: string): Observable<any> {
    const body = {
      submit_reject: 'true',
      reason
    };
    return this.postToEndpoint(this.linkPath, this.halService.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public returnToPoolTask(scopeId: string): Observable<any> {
    return this.deleteToEndpoint(this.linkPath, {}, scopeId, this.makeHttpOptions());
  }

}

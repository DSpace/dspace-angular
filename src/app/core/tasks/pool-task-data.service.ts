import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { NormalizedPoolTask } from './models/normalized-pool-task-object.model';
import { PoolTask } from './models/pool-task-object.model';
import { PostRequest, RestRequest, TaskPostRequest } from '../data/request.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ErrorResponse, RestResponse, TaskResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { HttpHeaders } from '@angular/common/http';
import { TasksService } from './tasks.service';

@Injectable()
export class PoolTaskDataService extends TasksService<NormalizedPoolTask, PoolTask> {
  protected linkName = 'pooltasks';
  protected overrideRequest = true;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private bs: BrowseService) {
    super(NormalizedPoolTask);
  }

  public claimTask(scopeId: string ): Observable<any> {
    return this.postToEndpoint('', {}, scopeId, this.makeHttpOptions());
  }
}

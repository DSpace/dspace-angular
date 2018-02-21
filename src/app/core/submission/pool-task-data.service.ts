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
import { NormalizedPoolTask } from './models/tasks/normalized-pool-task-object.model';
import { PoolTask } from './models/tasks/pool-task-object.model';

@Injectable()
export class PoolTaskDataService extends DataService<NormalizedPoolTask, PoolTask> {
  protected linkName = 'poolTask';
  protected overrideRequest = true;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private bs: BrowseService) {
    super(NormalizedPoolTask);
  }

  public getScopedEndpoint(scopeID: string): Observable<string> {
    return this.getEndpoint();
  }

/*
  findAll(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<PoolTask>>> {
    const hrefObs = this.getEndpoint().filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<NormalizedPoolTask, PoolTask>(hrefObs, this.normalizedResourceType) as Observable<RemoteData<PaginatedList<PoolTask>>>;
  }

  findById(id: string): Observable<RemoteData<PoolTask>> {
    const hrefObs = this.getEndpoint()
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<NormalizedPoolTask, PoolTask>(hrefObs, this.normalizedResourceType);
  }

  findByHref(href: string): Observable<RemoteData<PoolTask>> {
    this.requestService.configure(new SubmissionRequest(this.requestService.generateRequestId(), href));
    return this.rdbService.buildSingle<NormalizedPoolTask, PoolTask>(href, this.normalizedResourceType);
  }*/
}

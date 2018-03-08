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
import { NormalizedWorkflowItem } from './models/normalized-workflowitem.model';
import { Workflowitem } from './models/workflowitem.model';

@Injectable()
export class WorkflowitemDataService extends DataService<NormalizedWorkflowItem, Workflowitem> {
  protected linkName = 'workflowitems';
  protected overrideRequest = true;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private bs: BrowseService) {
    super(NormalizedWorkflowItem);
  }

  public getScopedEndpoint(scopeID: string): Observable<string> {
    return this.getEndpoint();
  }

/*
  findAll(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<Workflowitem>>> {
    const hrefObs = this.getEndpoint().filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<NormalizedWorkflowItem, Workflowitem>(hrefObs, this.normalizedResourceType) as Observable<RemoteData<PaginatedList<Workflowitem>>>;
  }

  findById(id: string): Observable<RemoteData<Workflowitem>> {
    const hrefObs = this.getEndpoint()
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<NormalizedWorkflowItem, Workflowitem>(hrefObs, this.normalizedResourceType);
  }

  findByHref(href: string): Observable<RemoteData<Workflowitem>> {
    this.requestService.configure(new SubmissionRequest(this.requestService.generateRequestId(), href));
    return this.rdbService.buildSingle<NormalizedWorkflowItem, Workflowitem>(href, this.normalizedResourceType);
  }*/
}

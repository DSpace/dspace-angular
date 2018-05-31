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
import { Workspaceitem } from './models/workspaceitem.model';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class WorkspaceitemDataService extends DataService<NormalizedWorkspaceItem, Workspaceitem> {
  protected linkPath = 'workspaceitems';
  protected overrideRequest = true;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected halService: HALEndpointService) {
    super();
  }

  public getScopedEndpoint(scopeID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

/*
  findAll(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<Workspaceitem>>> {
    const hrefObs = this.getEndpoint().filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<NormalizedWorkspaceItem, Workspaceitem>(hrefObs, this.normalizedResourceType) as Observable<RemoteData<PaginatedList<Workspaceitem>>>;
  }

  findById(id: string): Observable<RemoteData<Workspaceitem>> {
    const hrefObs = this.getEndpoint()
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new SubmissionFindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<NormalizedWorkspaceItem, Workspaceitem>(hrefObs, this.normalizedResourceType);
  }

  findByHref(href: string): Observable<RemoteData<Workspaceitem>> {
    this.requestService.configure(new SubmissionRequest(this.requestService.generateRequestId(), href));
    return this.rdbService.buildSingle<NormalizedWorkspaceItem, Workspaceitem>(href, this.normalizedResourceType);
  }*/
}

import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { Workspaceitem } from './models/workspaceitem.model';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindAllOptions } from '../data/request.models';

@Injectable()
export class WorkspaceitemDataService extends DataService<NormalizedWorkspaceItem, Workspaceitem> {
  protected linkPath = 'workspaceitems';
  protected forceBypassCache = true;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected halService: HALEndpointService) {
    super();
  }

  public getBrowseEndpoint(options: FindAllOptions) {
    return this.halService.getEndpoint(this.linkPath);
  }

}

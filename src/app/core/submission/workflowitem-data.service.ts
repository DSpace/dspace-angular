import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { WorkflowItem } from './models/workflowitem.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindAllOptions } from '../data/request.models';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';

/**
 * A service that provides methods to make REST requests with workflowitems endpoint.
 */
@Injectable()
export class WorkflowItemDataService extends DataService<WorkflowItem> {
  protected linkPath = 'workflowitems';
  protected forceBypassCache = true;

  constructor(
    protected comparator: DSOChangeAnalyzer<WorkflowItem>,
    protected dataBuildService: NormalizedObjectBuildService,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected store: Store<CoreState>) {
    super();
  }

  public getBrowseEndpoint(options: FindAllOptions) {
    return this.halService.getEndpoint(this.linkPath);
  }

}

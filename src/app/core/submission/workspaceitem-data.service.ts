import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindListOptions } from '../data/request.models';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { WorkspaceItem } from './models/workspaceitem.model';

/**
 * A service that provides methods to make REST requests with workspaceitems endpoint.
 */
@Injectable()
@dataService(WorkspaceItem.type)
export class WorkspaceitemDataService extends DataService<WorkspaceItem> {
  protected linkPath = 'workspaceitems';

  constructor(
    protected comparator: DSOChangeAnalyzer<WorkspaceItem>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected store: Store<CoreState>) {
    super();
  }

}

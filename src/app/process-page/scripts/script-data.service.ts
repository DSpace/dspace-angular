import { Injectable } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { RequestService } from '../../core/data/request.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../../core/data/default-change-analyzer.service';
import { Script } from './script.model';

@Injectable()
export class ScriptDataService extends DataService<Script> {
  protected linkPath = 'scripts';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Script>) {
    super();
  }
}

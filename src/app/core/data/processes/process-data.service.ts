import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { Process } from '../../../process-page/processes/process.model';
import { dataService } from '../../cache/builders/build-decorators';
import { PROCESS } from '../../../process-page/processes/process.resource-type';

@Injectable()
@dataService(PROCESS)
export class ProcessDataService extends DataService<Process> {
  protected linkPath = 'processes';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Process>) {
    super();
  }
}

import { Injectable } from '@angular/core';
import { FEATURE } from '../../shared/feature.resource-type';
import { dataService } from '../../cache/builders/build-decorators';
import { DataService } from '../data.service';
import { Feature } from '../../shared/feature.model';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';

/**
 * A service to retrieve {@link Feature}s from the REST API
 */
@Injectable()
@dataService(FEATURE)
export class FeatureDataService extends DataService<Feature> {
  protected linkPath = 'features';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Feature>
  ) {
    super();
  }
}

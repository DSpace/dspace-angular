import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Metric } from "../shared/metric.model";
import { dataService } from "../cache/builders/build-decorators";
import { METRIC } from "../shared/metric.resource-type";

/**
 * A service handling all external source requests
 */
@Injectable()
@dataService(METRIC)
export class MetricService extends DataService<Metric> {
  protected linkPath = 'metrics';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Metric>) {
    super();
  }

}

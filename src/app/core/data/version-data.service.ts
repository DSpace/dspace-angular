import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Version } from '../shared/version.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { dataService } from '../cache/builders/build-decorators';
import { VERSION } from '../shared/version.resource-type';

/**
 * Service responsible for handling requests related to the Version object
 */
@Injectable()
@dataService(VERSION)
export class VersionDataService extends DataService<Version> {
  protected linkPath = 'versions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Version>) {
    super();
  }

  /**
   * Get the endpoint for browsing versions
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}

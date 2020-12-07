import { DataService } from './data.service';
import { Root } from './root.model';
import { Injectable } from '@angular/core';
import { ROOT } from './root.resource-type';
import { dataService } from '../cache/builders/build-decorators';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<Root> {
  protected linkPath = '';
  protected responseMsToLive = 6 * 60 * 60 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Root>) {
    super();
  }
}

/**
 * A service to retrieve the {@link Root} object from the REST API.
 */
@Injectable()
@dataService(ROOT)
export class RootDataService {
  /**
   * A private DataService instance to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Root>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Find the {@link Root} object of the REST API
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findRoot(...linksToFollow: Array<FollowLinkConfig<Root>>): Observable<RemoteData<Root>> {
    return this.dataService.findByHref(this.halService.getRootHref(), ...linksToFollow);
  }
}
/* tslint:enable:max-classes-per-file */

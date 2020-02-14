import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { License } from '../shared/license.model';
import { LICENSE } from '../shared/license.resource-type';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindListOptions } from './request.models';
import { RequestService } from './request.service';

class DataServiceImpl extends DataService<License> {
  protected linkPath = '';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<License>) {
    super();
  }
}

@Injectable()
@dataService(LICENSE)
export class LicenseDataService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<License>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<License>>): Observable<RemoteData<License>> {
    return this.dataService.findByHref(href, ...linksToFollow);
  }

  findByAllHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<License>>): Observable<RemoteData<PaginatedList<License>>> {
    return this.dataService.findAllByHref(href, findListOptions, ...linksToFollow);
  }
}

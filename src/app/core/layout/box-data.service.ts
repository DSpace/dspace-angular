import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Box } from './models/box.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { dataService } from '../cache/builders/build-decorators';
import { BOX } from './models/box.resource-type';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PaginatedList } from '../data/paginated-list';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';

/* tslint:disable:max-classes-per-file */

class DataServiceImpl extends DataService<Box> {
  protected linkPath = 'boxes';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<Box>) {
    super();
  }
}
/**
 * A service responsible for fetching data from the REST API on the boxes endpoint
 */
@Injectable()
@dataService(BOX)
export class BoxDataService {
  protected searchFindByItem = 'findByItem';
  protected searchFindByEntityType = 'findByEntityType';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Box>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * Provide detailed information about a specific box.
   * @param id id of the box
   */
  findById(id: string): Observable<RemoteData<Box>> {
    return this.dataService.findById(id);
  }

  /**
   * It returns the boxes that are available for the specified item in the requested tab.
   * The boxes are sorted by priority ascending. This are filtered based on the permission
   * of the current user and available data in the items (empty boxes are not included).
   * @param itemUuid UUID of item
   * @param tabId id of tab
   * @param linkToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findByItem(itemUuid: string, tabId: number, ...linksToFollow: Array<FollowLinkConfig<Box>>): Observable<RemoteData<PaginatedList<Box>>> {
    const options = new FindListOptions();
    options.searchParams = [
      new RequestParam('uuid', itemUuid),
      new RequestParam('tab', tabId)
    ];
    return this.dataService.searchBy(this.searchFindByItem, options, ...linksToFollow);
  }

  /**
   * It returns the boxes that are available for the items of the specified type.
   * This endpoint is reserved to system administrators
   * @param entityType label of entity type
   * @param linkToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findByEntityType(entityType: string, ...linksToFollow: Array<FollowLinkConfig<Box>>): Observable<RemoteData<PaginatedList<Box>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('type', entityType)]
    return this.dataService.searchBy(this.searchFindByEntityType, options, ...linksToFollow);
  }
}

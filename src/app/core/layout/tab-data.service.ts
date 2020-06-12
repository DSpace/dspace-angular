import { Injectable } from '@angular/core';
import { Tab } from '../layout/models/tab.model';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { TAB } from '../layout/models/tab.resource-type';
import { dataService } from '../cache/builders/build-decorators';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';

/* tslint:disable:max-classes-per-file */

class DataServiceImpl extends DataService<Tab> {
  protected linkPath = 'tabs';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<Tab>) {
    super();
  }
}
/**
 * A service responsible for fetching data from the REST API on the tabs endpoint
 */
@Injectable()
@dataService(TAB)
export class TabDataService {
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
    protected comparator: DefaultChangeAnalyzer<Tab>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * Provide detailed information about a specific tab.
   * @param id id of tab
   */
  findById(id: string): Observable<RemoteData<Tab>> {
    return this.dataService.findById(id);
  }

  /**
   * It returns the tabs that are available for the specified item. The tabs are sorted by
   * priority ascending. This are filtered based on the permission of the current user and
   * available data. Empty tabs are filter out.
   * @param itemUuid UUID of the Item
   * @param linkToFollow
   */
  findByItem(itemUuid: string, linkToFollow?: FollowLinkConfig<Tab>): Observable<RemoteData<PaginatedList<Tab>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', itemUuid)]
    return this.dataService.searchBy(this.searchFindByItem, options);
  }

  /**
   * It returns the tabs that are available for the items of the specified type.
   * This endpoint is reserved to system administrators
   * @param entityType label of the entity type
   */
  findByEntityType(entityType: string): Observable<RemoteData<PaginatedList<Tab>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('type', entityType)]
    return this.dataService.searchBy(this.searchFindByEntityType, options);
  }
}

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
import { ItemType } from '../shared/item-relationships/item-type.model';
import { ITEM_TYPE } from '../shared/item-relationships/item-type.resource-type';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindListOptions } from './request.models';
import { RequestService } from './request.service';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<ItemType> {
  protected linkPath = 'entitytypes';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemType>) {
    super();
  }
}

@Injectable()
@dataService(ITEM_TYPE)
export class ItemTypeDataService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemType>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve HALLinks of the object
   * @param href            Href of object we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which HALLinks should be automatically resolved
   */
  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<ItemType>>): Observable<RemoteData<ItemType>> {
    return this.dataService.findByHref(href, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve HALLinks of the object
   * @param id              ID of object we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which HALLinks should be automatically resolved
   */
  findByAllHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<ItemType>>): Observable<RemoteData<PaginatedList<ItemType>>> {
    return this.dataService.findAllByHref(href, findListOptions, ...linksToFollow);
  }
}
/* tslint:enable:max-classes-per-file */

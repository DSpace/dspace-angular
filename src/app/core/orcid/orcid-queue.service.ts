/* tslint:disable:max-classes-per-file */

import { DataService } from '../data/data.service';
import { OrcidQueue } from './model/orcid-queue.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { ORCID_QUEUE } from './model/orcid-queue.resource-type';
import { ItemDataService } from '../data/item-data.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { RequestParam } from '../cache/models/request-param.model';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { RestResponse } from '../cache/response.models';
import { tap } from 'rxjs/operators';

/**
 * A private DataService implementation to delegate specific methods to.
 */
class OrcidQueueServiceImpl extends DataService<OrcidQueue> {
  public linkPath = 'orcidqueues';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<OrcidQueue>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with Orcid Queue endpoint.
 */
@Injectable()
@dataService(ORCID_QUEUE)
export class OrcidQueueService {

  dataService: OrcidQueueServiceImpl;

  responseMsToLive: number = 10 * 1000;

  constructor(
      protected requestService: RequestService,
      protected rdbService: RemoteDataBuildService,
      protected store: Store<CoreState>,
      protected objectCache: ObjectCacheService,
      protected halService: HALEndpointService,
      protected notificationsService: NotificationsService,
      protected http: HttpClient,
      protected comparator: DefaultChangeAnalyzer<OrcidQueue>,
      protected itemService: ItemDataService ) {

          this.dataService = new OrcidQueueServiceImpl(requestService, rdbService, store, objectCache, halService,
              notificationsService, http, comparator);

  }

  searchByOwnerId(itemId: string, paginationOptions: PaginationComponentOptions): Observable<RemoteData<PaginatedList<OrcidQueue>>> {
    return this.dataService.searchBy('findByOwner', {
      searchParams: [new RequestParam('ownerId', itemId)],
      elementsPerPage: paginationOptions.pageSize,
      currentPage: paginationOptions.currentPage
    }).pipe(tap((result) => {
      this.requestService.removeByHrefSubstring(this.dataService.linkPath + '/search/findByOwner')
    }));
  }

  deleteById(orcidQueueId: number): Observable<RestResponse> {
    return this.dataService.delete(orcidQueueId + '');
  }

}

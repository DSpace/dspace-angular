// eslint-disable-next-line max-classes-per-file
import { DataService } from '../data/data.service';
import { OrcidQueue } from './model/orcid-queue.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { ORCID_QUEUE } from './model/orcid-queue.resource-type';
import { ItemDataService } from '../data/item-data.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { RequestParam } from '../cache/models/request-param.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { NoContent } from '../shared/NoContent.model';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { Router } from '@angular/router';
import { CoreState } from '../core-state.model';

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
      protected configurationService: ConfigurationDataService,
      protected router: Router,
      protected itemService: ItemDataService ) {

          this.dataService = new OrcidQueueServiceImpl(requestService, rdbService, store, objectCache, halService,
              notificationsService, http, comparator);

  }

  /**
   * @param itemId                      It represent an Id of profileItem
   * @param paginationOptions           The pagination options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @returns { OrcidQueue }
   */
  searchByProfileItemId(itemId: string, paginationOptions: PaginationComponentOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<RemoteData<PaginatedList<OrcidQueue>>> {
    return this.dataService.searchBy('findByProfileItem', {
        searchParams: [new RequestParam('profileItemId', itemId)],
        elementsPerPage: paginationOptions.pageSize,
        currentPage: paginationOptions.currentPage
      },
      useCachedVersionIfAvailable,
      reRequestOnStale
    );
  }

  /**
   * @param orcidQueueId represents a id of orcid queue
   * @returns { NoContent }
   */
  deleteById(orcidQueueId: number): Observable<RemoteData<NoContent>> {
    return this.dataService.delete(orcidQueueId.toString());
  }

  /**
   * This method will set linkPath to stale
   */
  clearFindByProfileItemRequests() {
    this.requestService.setStaleByHrefSubstring(this.dataService.linkPath + '/search/findByProfileItem');
  }

}

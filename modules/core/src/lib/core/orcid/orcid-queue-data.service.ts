import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ObjectCacheService,
  RemoteDataBuildService,
  RequestParam,
} from '../cache';
import {
  DeleteData,
  DeleteDataImpl,
  IdentifiableDataService,
  PaginatedList,
  RemoteData,
  RequestService,
  SearchData,
  SearchDataImpl,
} from '../data';
import { NotificationsService } from '../notifications';
import {
  HALEndpointService,
  NoContent,
  PaginationComponentOptions,
} from '../shared';
import { OrcidQueue } from './model';

/**
 * A service that provides methods to make REST requests with Orcid Queue endpoint.
 */
@Injectable({ providedIn: 'root' })
export class OrcidQueueDataService extends IdentifiableDataService<OrcidQueue> {
  private searchData: SearchData<OrcidQueue>;
  private deleteData: DeleteData<OrcidQueue>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('orcidqueues', requestService, rdbService, objectCache, halService, 10 * 1000);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
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
    return this.searchData.searchBy('findByProfileItem', {
      searchParams: [new RequestParam('profileItemId', itemId)],
      elementsPerPage: paginationOptions.pageSize,
      currentPage: paginationOptions.currentPage,
    },
    useCachedVersionIfAvailable,
    reRequestOnStale,
    );
  }

  /**
   * @param orcidQueueId represents a id of orcid queue
   * @returns { NoContent }
   */
  deleteById(orcidQueueId: number): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(orcidQueueId.toString());
  }

  /**
   * This method will set linkPath to stale
   */
  clearFindByProfileItemRequests() {
    this.requestService.setStaleByHrefSubstring(this.linkPath + '/search/findByProfileItem');
  }

}

import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  getAllSucceededRemoteDataPayload,
  getPaginatedListPayload,
} from '../shared/operators';
import { CorrectionType } from './models/correctiontype.model';

/**
 * A service that provides methods to make REST requests with correctiontypes endpoint.
 */
@Injectable({ providedIn: 'root' })
export class CorrectionTypeDataService extends IdentifiableDataService<CorrectionType> {
  protected linkPath = 'correctiontypes';
  protected searchByTopic = 'findByTopic';
  protected searchFindByItem = 'findByItem';
  private searchData: SearchDataImpl<CorrectionType>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('correctiontypes', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Get the correction type by id
   * @param id the id of the correction type
   * @param useCachedVersionIfAvailable use the cached version if available
   * @param reRequestOnStale re-request on stale
   * @returns {Observable<RemoteData<CorrectionType>>} the correction type
   */
  getCorrectionTypeById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<RemoteData<CorrectionType>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale);
  }

  /**
   * Search for the correction types for the item
   * @param itemUuid the uuid of the item
   * @param useCachedVersionIfAvailable use the cached version if available
   * @returns the list of correction types for the item
   */
  findByItem(itemUuid: string, useCachedVersionIfAvailable): Observable<RemoteData<PaginatedList<CorrectionType>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', itemUuid)];
    return this.searchData.searchBy(this.searchFindByItem, options, useCachedVersionIfAvailable);
  }

  /**
   * Find the correction type for the topic
   * @param topic the topic of the correction type to search for
   * @param useCachedVersionIfAvailable use the cached version if available
   * @param reRequestOnStale re-request on stale
   * @returns the correction type for the topic
   */
  findByTopic(topic: string, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<CorrectionType> {
    const options = new FindListOptions();
    options.searchParams = [
      new RequestParam('topic', topic),
    ];

    return this.searchData.searchBy(this.searchByTopic, options, useCachedVersionIfAvailable, reRequestOnStale).pipe(
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((list: CorrectionType[]) => {
        return list[0];
      }),
    );
  }
}

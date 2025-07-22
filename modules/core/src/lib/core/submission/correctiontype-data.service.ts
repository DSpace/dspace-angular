import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';

import {
  ObjectCacheService,
  RemoteDataBuildService,
  RequestParam,
} from '../cache';
import {
  FindListOptions,
  IdentifiableDataService,
  PaginatedList,
  RemoteData,
  RequestService,
  SearchDataImpl,
} from '../data';
import { NotificationsService } from '../notifications';
import {
  getAllSucceededRemoteDataPayload,
  getPaginatedListPayload,
  HALEndpointService,
} from '../shared';
import { CorrectionType } from './models';

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

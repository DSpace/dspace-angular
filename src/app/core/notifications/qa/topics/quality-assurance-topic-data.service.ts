import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import {
  FindAllData,
  FindAllDataImpl,
} from '../../../data/base/find-all-data';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import {
  SearchData,
  SearchDataImpl,
} from '../../../data/base/search-data';
import { FindListOptions } from '../../../data/find-list-options.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { RemoteData } from '../../../data/remote-data';
import { RequestService } from '../../../data/request.service';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { QualityAssuranceTopicObject } from '../models/quality-assurance-topic.model';

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable({ providedIn: 'root' })
export class QualityAssuranceTopicDataService extends IdentifiableDataService<QualityAssuranceTopicObject> {

  private findAllData: FindAllData<QualityAssuranceTopicObject>;
  private searchData: SearchData<QualityAssuranceTopicObject>;

  private searchByTargetMethod = 'byTarget';
  private searchBySourceMethod = 'bySource';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('qualityassurancetopics', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Search for Quality Assurance topics.
   * @param options The search options.
   * @param useCachedVersionIfAvailable Whether to use cached version if available.
   * @param reRequestOnStale Whether to re-request on stale.
   * @param linksToFollow The links to follow.
   * @returns An observable of remote data containing a paginated list of Quality Assurance topics.
   */
  public searchTopicsByTarget(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>> {
    return this.searchData.searchBy(this.searchByTargetMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Searches for quality assurance topics by source.
   * @param options The search options.
   * @param useCachedVersionIfAvailable Whether to use a cached version if available.
   * @param reRequestOnStale Whether to re-request the data if it's stale.
   * @param linksToFollow The links to follow.
   * @returns An observable of the remote data containing the paginated list of quality assurance topics.
   */
  public searchTopicsBySource(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>> {
    return this.searchData.searchBy(this.searchBySourceMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Clear FindAll topics requests from cache
   */
  public clearFindAllTopicsRequests() {
    this.requestService.setStaleByHrefSubstring('qualityassurancetopics');
  }

  /**
   * Return a single Quality Assurance topic.
   *
   * @param id                          The Quality Assurance topic id
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<QualityAssuranceTopicObject>>
   *    The Quality Assurance topic.
   */
  public getTopic(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<QualityAssuranceTopicObject>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}

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
import { QualityAssuranceSourceObject } from '../models/quality-assurance-source.model';

/**
 * The service handling all Quality Assurance source REST requests.
 */
@Injectable({ providedIn: 'root' })
export class QualityAssuranceSourceDataService extends IdentifiableDataService<QualityAssuranceSourceObject> {

  private findAllData: FindAllData<QualityAssuranceSourceObject>;
  private searchAllData: SearchData<QualityAssuranceSourceObject>;

  private searchByTargetMethod = 'byTarget';

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
    super('qualityassurancesources', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchAllData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Return the list of Quality Assurance source.
   *
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>>
   *    The list of Quality Assurance source.
   */
  public getSources(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceSourceObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Clear FindAll source requests from cache
   */
  public clearFindAllSourceRequests() {
    this.requestService.setStaleByHrefSubstring('qualityassurancesources');
  }

  /**
   * Return a single Quality Assurance source.
   *
   * @param id                          The Quality Assurance source id
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<QualityAssuranceSourceObject>>    The Quality Assurance source.
   */
  public getSource(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceSourceObject>[]): Observable<RemoteData<QualityAssuranceSourceObject>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieves a paginated list of QualityAssuranceSourceObject objects that are associated with a given target object.
   * @param options The options for the search query.
   * @param useCachedVersionIfAvailable Whether to use a cached version of the data if available.
   * @param reRequestOnStale Whether to re-request the data if the cached version is stale.
   * @param linksToFollow The links to follow to retrieve the data.
   * @returns An observable that emits a RemoteData object containing the paginated list of QualityAssuranceSourceObject objects.
   */
  public getSourcesByTarget(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceSourceObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>> {
    return this.searchAllData.searchBy(this.searchByTargetMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}

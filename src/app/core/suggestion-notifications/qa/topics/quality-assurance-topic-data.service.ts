import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { RequestService } from '../../../data/request.service';
import { RemoteData } from '../../../data/remote-data';
import { QualityAssuranceTopicObject } from '../models/quality-assurance-topic.model';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { FindListOptions } from '../../../data/find-list-options.model';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { QUALITY_ASSURANCE_TOPIC_OBJECT } from '../models/quality-assurance-topic-object.resource-type';
import { FindAllData, FindAllDataImpl } from '../../../data/base/find-all-data';
import { hasValue } from 'src/app/shared/empty.util';
import { SearchData, SearchDataImpl } from 'src/app/core/data/base/search-data';

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_TOPIC_OBJECT)
export class QualityAssuranceTopicDataService extends IdentifiableDataService<QualityAssuranceTopicObject> {

  private findAllData: FindAllData<QualityAssuranceTopicObject>;
  private searchData: SearchData<QualityAssuranceTopicObject>;

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
    protected notificationsService: NotificationsService
  ) {
    super('qualityassurancetopics', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Return the list of Quality Assurance topics.
   *
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>>
   *    The list of Quality Assurance topics.
   */
  public getTopics(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieves a paginated list of QualityAssuranceTopicObjects by target and source.
   * @param target The target to search for (the item's uuid).
   * @param source The source to search for (optional).
   * @param options The find list options (optional).
   * @param useCachedVersionIfAvailable Whether to use a cached version if available (optional, default is true).
   * @param reRequestOnStale Whether to re-request if the cached version is stale (optional, default is true).
   * @param linksToFollow The links to follow (optional).
   * @returns An observable of RemoteData<PaginatedList<QualityAssuranceTopicObject>>.
   */
  public getTopicsByTargetAndSource(target: string, source?: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>> {
    options.searchParams = [
      {
        fieldName: 'target',
        fieldValue: target
      }
    ];

    if (hasValue(source)) {
      options.searchParams.push({
        fieldName: 'source',
        fieldValue: source
      });
    }

    return this.searchData.searchBy(this.searchByTargetMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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

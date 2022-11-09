import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

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

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_TOPIC_OBJECT)
export class QualityAssuranceTopicRestService extends IdentifiableDataService<QualityAssuranceTopicObject> {

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
  }

  /**
   * Return the list of Quality Assurance topics.
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>>
   *    The list of Quality Assurance topics.
   */
  public getTopics(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>> {
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => this.findListByHref(href, options, true, true, ...linksToFollow)),
    );
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
   * @param id
   *    The Quality Assurance topic id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<QualityAssuranceTopicObject>>
   *    The Quality Assurance topic.
   */
  public getTopic(id: string, ...linksToFollow: FollowLinkConfig<QualityAssuranceTopicObject>[]): Observable<RemoteData<QualityAssuranceTopicObject>> {
    const options = {};
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => this.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}

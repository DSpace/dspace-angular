import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { RequestService } from '../../../data/request.service';
import { FindListOptions } from '../../../data/find-list-options.model';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireBrokerTopicObject } from '../models/openaire-broker-topic.model';
import { OPENAIRE_BROKER_TOPIC_OBJECT } from '../models/openaire-broker-topic-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';

/**
 * The service handling all OpenAIRE Broker topic REST requests.
 */
@Injectable()
@dataService(OPENAIRE_BROKER_TOPIC_OBJECT)
export class OpenaireBrokerTopicRestService extends IdentifiableDataService<OpenaireBrokerTopicObject> {

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
    super('nbtopics', requestService, rdbService, objectCache, halService);
  }

  /**
   * Return the list of OpenAIRE Broker topics.
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<OpenaireBrokerTopicObject>>>
   *    The list of OpenAIRE Broker topics.
   */
  public getTopics(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<OpenaireBrokerTopicObject>[]): Observable<RemoteData<PaginatedList<OpenaireBrokerTopicObject>>> {
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => this.findListByHref(href, options, true, true, ...linksToFollow)),
    );
  }

  /**
   * Clear FindAll topics requests from cache
   */
  public clearFindAllTopicsRequests() {
    this.requestService.setStaleByHrefSubstring('nbtopics');
  }

  /**
   * Return a single OpenAIRE Broker topic.
   *
   * @param id
   *    The OpenAIRE Broker topic id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<OpenaireBrokerTopicObject>>
   *    The OpenAIRE Broker topic.
   */
  public getTopic(id: string, ...linksToFollow: FollowLinkConfig<OpenaireBrokerTopicObject>[]): Observable<RemoteData<OpenaireBrokerTopicObject>> {
    const options = {};
    return this.getBrowseEndpoint(options, 'nbtopics').pipe(
      take(1),
      mergeMap((href: string) => this.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}

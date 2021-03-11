import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { CoreState } from '../../../core.reducers';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../cache/builders/build-decorators';
import { RequestService } from '../../../data/request.service';
import { FindListOptions } from '../../../data/request.models';
import { DataService } from '../../../data/data.service';
import { ChangeAnalyzer } from '../../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireBrokerTopicObject } from '../models/openaire-broker-topic.model';
import { OPENAIRE_BROKER_TOPIC_OBJECT } from '../models/openaire-broker-topic-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<OpenaireBrokerTopicObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'nbtopics';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<OpenaireBrokerTopicObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<OpenaireBrokerTopicObject>) {
    super();
  }
}

/**
 * The service handling all OpenAIRE Broker topic REST requests.
 */
@Injectable()
@dataService(OPENAIRE_BROKER_TOPIC_OBJECT)
export class OpenaireBrokerTopicRestService {
  /**
   * A private DataService implementation to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {DefaultChangeAnalyzer<OpenaireBrokerTopicObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<OpenaireBrokerTopicObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
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
    return this.dataService.getBrowseEndpoint(options, 'nbtopics').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findAllByHref(href, options, true, true, ...linksToFollow)),
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
    return this.dataService.getBrowseEndpoint(options, 'nbtopics').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../cache/builders/build-decorators';
import { RequestService } from '../../../data/request.service';
import { DataService } from '../../../data/data.service';
import { ChangeAnalyzer } from '../../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { QualityAssuranceTopicObject } from '../models/quality-assurance-topic.model';
import { QUALITY_ASSURANCE_TOPIC_OBJECT } from '../models/quality-assurance-topic-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import {CoreState} from '../../../core-state.model';
import {FindListOptions} from '../../../data/find-list-options.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<QualityAssuranceTopicObject> {
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
   * @param {ChangeAnalyzer<QualityAssuranceTopicObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<QualityAssuranceTopicObject>) {
    super();
  }
}

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_TOPIC_OBJECT)
export class QualityAssuranceTopicRestService {
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
   * @param {DefaultChangeAnalyzer<QualityAssuranceTopicObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<QualityAssuranceTopicObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
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
    return this.dataService.getBrowseEndpoint(options, 'nbtopics').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}

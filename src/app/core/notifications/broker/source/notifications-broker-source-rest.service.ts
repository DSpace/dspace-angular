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
import { NotificationsBrokerSourceObject } from '../models/notifications-broker-source.model';
import { NOTIFICATIONS_BROKER_SOURCE_OBJECT } from '../models/notifications-broker-source-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<NotificationsBrokerSourceObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'nbsources';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<NotificationsBrokerSourceObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<NotificationsBrokerSourceObject>) {
    super();
  }
}

/**
 * The service handling all Notifications Broker source REST requests.
 */
@Injectable()
@dataService(NOTIFICATIONS_BROKER_SOURCE_OBJECT)
export class NotificationsBrokerSourceRestService {
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
   * @param {DefaultChangeAnalyzer<NotificationsBrokerSourceObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<NotificationsBrokerSourceObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Return the list of Notifications Broker source.
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<NotificationsBrokerSourceObject>>>
   *    The list of Notifications Broker source.
   */
  public getSources(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<NotificationsBrokerSourceObject>[]): Observable<RemoteData<PaginatedList<NotificationsBrokerSourceObject>>> {
    return this.dataService.getBrowseEndpoint(options, 'nbsources').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findAllByHref(href, options, true, true, ...linksToFollow)),
    );
  }

  /**
   * Clear FindAll source requests from cache
   */
  public clearFindAllSourceRequests() {
    this.requestService.setStaleByHrefSubstring('nbsources');
  }

  /**
   * Return a single Notifications Broker source.
   *
   * @param id
   *    The Notifications Broker source id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<NotificationsBrokerSourceObject>>
   *    The Notifications Broker source.
   */
  public getSource(id: string, ...linksToFollow: FollowLinkConfig<NotificationsBrokerSourceObject>[]): Observable<RemoteData<NotificationsBrokerSourceObject>> {
    const options = {};
    return this.dataService.getBrowseEndpoint(options, 'nbsources').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}

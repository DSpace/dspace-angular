import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { CoreState } from '../../../core.reducers';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { RestResponse } from '../../../cache/response.models';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../cache/builders/build-decorators';
import { RequestService } from '../../../data/request.service';
import { FindListOptions } from '../../../data/request.models';
import { DataService } from '../../../data/data.service';
import { ChangeAnalyzer } from '../../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireBrokerEventObject } from '../models/openaire-broker-event.model';
import { OPENAIRE_BROKER_EVENT_OBJECT } from '../models/openaire-broker-event-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { ReplaceOperation } from 'fast-json-patch';
import { NoContent } from '../../../shared/NoContent.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<OpenaireBrokerEventObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'nbevents';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<OpenaireBrokerEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<OpenaireBrokerEventObject>) {
    super();
  }
}

/**
 * The service handling all OpenAIRE Broker topic REST requests.
 */
@Injectable()
@dataService(OPENAIRE_BROKER_EVENT_OBJECT)
export class OpenaireBrokerEventRestService {
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
   * @param {DefaultChangeAnalyzer<OpenaireBrokerEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<OpenaireBrokerEventObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Return the list of OpenAIRE Broker events by topic.
   *
   * @param topic
   *    The OpenAIRE Broker topic
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<OpenaireBrokerEventObject>>>
   *    The list of OpenAIRE Broker events.
   */
  public getEventsByTopic(topic: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<OpenaireBrokerEventObject>[]): Observable<RemoteData<PaginatedList<OpenaireBrokerEventObject>>> {
    options.searchParams = [
      {
        fieldName: 'topic',
        fieldValue: topic
      }
    ];
    return this.dataService.searchBy('findByTopic', options, true, true, ...linksToFollow);
  }

  /**
   * Clear findByTopic requests from cache
   */
  public clearFindByTopicRequests() {
    this.requestService.removeByHrefSubstring('findByTopic');
  }

  /**
   * Return a single OpenAIRE Broker event.
   *
   * @param id
   *    The OpenAIRE Broker event id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return Observable<RemoteData<OpenaireBrokerEventObject>>
   *    The OpenAIRE Broker event.
   */
  public getEvent(id: string, ...linksToFollow: FollowLinkConfig<OpenaireBrokerEventObject>[]): Observable<RemoteData<OpenaireBrokerEventObject>> {
    return this.dataService.findById(id, true, true, ...linksToFollow);
  }

  /**
   * Save the new status of an OpenAIRE Broker event.
   *
   * @param status
   *    The new status
   * @param dso OpenaireBrokerEventObject
   *    The event item
   * @param reason
   *    The optional reason (not used for now; for future implementation)
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public patchEvent(status, dso, reason?: string): Observable<RemoteData<OpenaireBrokerEventObject>> {
    const operation: ReplaceOperation<string>[] = [
      {
        path: '/status',
        op: 'replace',
        value: status
      }
    ];
    return this.dataService.patch(dso, operation);
  }

  /**
   * Bound a project to an OpenAIRE Broker event publication.
   *
   * @param itemId
   *    The Id of the OpenAIRE Broker event
   * @param projectId
   *    The project Id to bound
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public boundProject(itemId: string, projectId: string): Observable<RemoteData<OpenaireBrokerEventObject>> {
    return this.dataService.postOnRelated(itemId, projectId);
  }

  /**
   * Remove a project from an OpenAIRE Broker event publication.
   *
   * @param itemId
   *    The Id of the OpenAIRE Broker event
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public removeProject(itemId: string): Observable<RemoteData<NoContent>> {
    return this.dataService.deleteOnRelated(itemId);
  }
}

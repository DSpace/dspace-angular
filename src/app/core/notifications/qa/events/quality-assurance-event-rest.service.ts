import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { RestResponse } from '../../../cache/response.models';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../cache/builders/build-decorators';
import { RequestService } from '../../../data/request.service';
import { DataService } from '../../../data/data.service';
import { ChangeAnalyzer } from '../../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { QualityAssuranceEventObject } from '../models/quality-assurance-event.model';
import { QUALITY_ASSURANCE_EVENT_OBJECT } from '../models/quality-assurance-event-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { ReplaceOperation } from 'fast-json-patch';
import { NoContent } from '../../../shared/NoContent.model';
import {CoreState} from '../../../core-state.model';
import {FindListOptions} from '../../../data/find-list-options.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<QualityAssuranceEventObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'qaevents';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<QualityAssuranceEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<QualityAssuranceEventObject>) {
    super();
  }
}

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_EVENT_OBJECT)
export class QualityAssuranceEventRestService {
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
   * @param {DefaultChangeAnalyzer<QualityAssuranceEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<QualityAssuranceEventObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Return the list of Quality Assurance events by topic.
   *
   * @param topic
   *    The Quality Assurance topic
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceEventObject>>>
   *    The list of Quality Assurance events.
   */
  public getEventsByTopic(topic: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<QualityAssuranceEventObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceEventObject>>> {
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
   * Return a single Quality Assurance event.
   *
   * @param id
   *    The Quality Assurance event id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return Observable<RemoteData<QualityAssuranceEventObject>>
   *    The Quality Assurance event.
   */
  public getEvent(id: string, ...linksToFollow: FollowLinkConfig<QualityAssuranceEventObject>[]): Observable<RemoteData<QualityAssuranceEventObject>> {
    return this.dataService.findById(id, true, true, ...linksToFollow);
  }

  /**
   * Save the new status of a Quality Assurance event.
   *
   * @param status
   *    The new status
   * @param dso QualityAssuranceEventObject
   *    The event item
   * @param reason
   *    The optional reason (not used for now; for future implementation)
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public patchEvent(status, dso, reason?: string): Observable<RemoteData<QualityAssuranceEventObject>> {
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
   * Bound a project to a Quality Assurance event publication.
   *
   * @param itemId
   *    The Id of the Quality Assurance event
   * @param projectId
   *    The project Id to bound
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public boundProject(itemId: string, projectId: string): Observable<RemoteData<QualityAssuranceEventObject>> {
    return this.dataService.postOnRelated(itemId, projectId);
  }

  /**
   * Remove a project from a Quality Assurance event publication.
   *
   * @param itemId
   *    The Id of the Quality Assurance event
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public removeProject(itemId: string): Observable<RemoteData<NoContent>> {
    return this.dataService.deleteOnRelated(itemId);
  }
}

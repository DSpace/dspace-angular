import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { flatMap, take, tap, catchError, find, map } from 'rxjs/operators';

import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { hasValue } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RestResponse } from '../cache/response.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { dataService } from '../cache/builders/build-decorators';
import { RequestService } from '../data/request.service';
import { DeleteByIDRequest, FindListOptions, PostRequest } from '../data/request.models';
import { DataService } from '../data/data.service';
import { RequestEntry } from '../data/request.reducer';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RemoteData } from '../data/remote-data';
import { OpenaireBrokerEventObject } from './models/openaire-broker-event.model';
import { OPENAIRE_BROKER_EVENT_OBJECT } from './models/openaire-broker-event-object.resource-type';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../data/paginated-list';
import { ReplaceOperation } from 'fast-json-patch';

// TEST
import { ResourceType } from '../shared/resource-type';
import { PageInfo } from '../shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { of as observableOf } from 'rxjs';
import {
  openaireBrokerEventObjectMissingAbstract,
  openaireBrokerEventObjectMissingPid,
  openaireBrokerEventObjectMissingPid2,
  openaireBrokerEventObjectMissingPid3,
  openaireBrokerEventObjectMissingPid4,
  openaireBrokerEventObjectMissingPid5,
  openaireBrokerEventObjectMissingPid6,
  openaireBrokerEventObjectMissingProjectFound,
  openaireBrokerEventObjectMissingProjectNotFound
} from '../../shared/mocks/openaire-tmp.mock';

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

  /**
   * Perform a post on an OpenAIRE Broker event endpoint
   * @param eventId The event id
   * @param projectId The project id to bound
   * @return the RestResponse as an Observable
   */
  public postOnNbevent(eventId: string, projectId: string) {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getIDHrefObs(eventId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href + '/related?item=' + projectId);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
    );
  }

  /**
   * Perform a delete on an OpenAIRE Broker event endpoint
   * @param eventId The event id
   * @return the RestResponse as an Observable
   */
  public deleteOnNbevent(eventId: string) {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getIDHrefObs(eventId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new DeleteByIDRequest(requestId, href + '/related', eventId);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
    );
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
  public getEventsByTopic(topic: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<OpenaireBrokerEventObject>>): Observable<RemoteData<PaginatedList<OpenaireBrokerEventObject>>> {
    options.searchParams = [
      {
        fieldName: 'topic',
        fieldValue: topic
      }
    ];
    return this.dataService.searchBy('findByTopic', options, ...linksToFollow);
    // TEST
    /*const pageInfo = new PageInfo({
      elementsPerPage: options.elementsPerPage,
      totalElements: 6,
      totalPages: 1,
      currentPage: options.currentPage
    });
    let array = [ ];
    if (options.currentPage === 1) {
      array = [
        openaireBrokerEventObjectMissingPid,
        openaireBrokerEventObjectMissingPid2,
        openaireBrokerEventObjectMissingPid3,
        openaireBrokerEventObjectMissingPid4,
        openaireBrokerEventObjectMissingPid5,
        openaireBrokerEventObjectMissingPid6
      ];
    } else {
      array = [
        openaireBrokerEventObjectMissingPid6
      ];
    }*/
    /*const pageInfo = new PageInfo({
      elementsPerPage: options.elementsPerPage,
      totalElements: 0,
      totalPages: 1,
      currentPage: options.currentPage
    });
    let array = [ ];
    array = [
      openaireBrokerEventObjectMissingProjectFound,
      openaireBrokerEventObjectMissingProjectNotFound,
    ];*/
    /*const pageInfo = new PageInfo({
      elementsPerPage: options.elementsPerPage,
      totalElements: 1,
      totalPages: 1,
      currentPage: options.currentPage
    });
    let array = [ ];
    array = [
      openaireBrokerEventObjectMissingAbstract,
    ];*/
    // const paginatedList = new PaginatedList(pageInfo, array);
    // const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
    // return observableOf(paginatedListRD);
  }

  /**
   * Return a single OpenAIRE Broker event.
   *
   * @param id
   *    The OpenAIRE Broker event id
   * @return Observable<RemoteData<OpenaireBrokerEventObject>>
   *    The OpenAIRE Broker event.
   */
  public getEvent(id: string, ...linksToFollow: Array<FollowLinkConfig<OpenaireBrokerEventObject>>): Observable<RemoteData<OpenaireBrokerEventObject>> {
    return this.dataService.findById(id, ...linksToFollow);
  }

  /**
   * Save the new status of an OpenAIRE Broker event.
   *
   * @param status
   *    The new status
   * @param dso OpenaireBrokerEventObject
   *    The event item
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public patchEvent(status, dso): Observable<RestResponse> {
    const operation: Array<ReplaceOperation<string>> = [
      {
        path: '/status',
        op: 'replace',
        value: status
      }
    ];
    return this.dataService.patch(dso, operation);
    // return observableOf(new RestResponse(true, 200, 'Success'));
  }

  /**
   * Bound a project to an OpenAIRE Broker event publication.
   *
   * @param itemId
   *    The Id of the item to remove
   * @param projectId
   *    The project Id to bound
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public boundProject(itemId: string, projectId: string): Observable<RestResponse> {
    return this.dataService.postOnNbevent(itemId, projectId);
    // return observableOf(new RestResponse(true, 201, 'Success'));
  }

  /**
   * Remove a project from an OpenAIRE Broker event publication.
   *
   * @param itemId
   *    The Id of the item to remove
   * @return Observable<RestResponse>
   *    The REST response.
   */
  public removeProject(itemId: string): Observable<RestResponse> {
    return this.dataService.deleteOnNbevent(itemId);
    // return observableOf(new RestResponse(true, 204, 'Success'));
  }
}

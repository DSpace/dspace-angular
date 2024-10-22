/* eslint-disable max-classes-per-file */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { find, take } from 'rxjs/operators';
import { ReplaceOperation } from 'fast-json-patch';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { RequestService } from '../../../data/request.service';
import { FindListOptions } from '../../../data/find-list-options.model';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireBrokerEventObject } from '../models/openaire-broker-event.model';
import { OPENAIRE_BROKER_EVENT_OBJECT } from '../models/openaire-broker-event-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { NoContent } from '../../../shared/NoContent.model';
import { CreateData, CreateDataImpl } from '../../../data/base/create-data';
import { DeleteData, DeleteDataImpl } from '../../../data/base/delete-data';
import { SearchData, SearchDataImpl } from '../../../data/base/search-data';
import { PatchData, PatchDataImpl } from '../../../data/base/patch-data';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import { DeleteByIDRequest, PostRequest } from '../../../data/request.models';
import { hasValue } from '../../../../shared/empty.util';
import { RequestParam } from '../../../cache/models/request-param.model';

/**
 * The service handling all OpenAIRE Broker topic REST requests.
 */
@Injectable()
@dataService(OPENAIRE_BROKER_EVENT_OBJECT)
export class OpenaireBrokerEventRestService extends IdentifiableDataService<OpenaireBrokerEventObject> {

  private createData: CreateData<OpenaireBrokerEventObject>;
  private searchData: SearchData<OpenaireBrokerEventObject>;
  private patchData: PatchData<OpenaireBrokerEventObject>;
  private deleteData: DeleteData<OpenaireBrokerEventObject>;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {DefaultChangeAnalyzer<OpenaireBrokerEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected comparator: DefaultChangeAnalyzer<OpenaireBrokerEventObject>
  ) {
    super('nbevents', requestService, rdbService, objectCache, halService);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.patchData = new PatchDataImpl<OpenaireBrokerEventObject>(this.linkPath, requestService, rdbService, objectCache, halService, comparator, this.responseMsToLive, this.constructIdEndpoint);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
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
      new RequestParam('topic', topic, false),
    ];
    return this.searchData.searchBy('findByTopic', options, true, true, ...linksToFollow);
  }

  /**
   * Clear findByTopic requests from cache
   */
  public clearFindByTopicRequests() {
    this.requestService.setStaleByHrefSubstring('findByTopic');
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
    return this.findById(id, true, true, ...linksToFollow);
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
    return this.patchData.patch(dso, operation);
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
    return this.postOnRelated(itemId, projectId);
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
    return this.deleteOnRelated(itemId);
  }


  /**
   * Perform a delete operation on an endpoint related item. Ex.: endpoint/<itemId>/related
   * @param objectId The item id
   * @return the RestResponse as an Observable
   */
  private deleteOnRelated(objectId: string): Observable<RemoteData<NoContent>> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.getIDHrefObs(objectId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new DeleteByIDRequest(requestId, href + '/related', objectId);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID<OpenaireBrokerEventObject>(requestId);
  }

  /**
   * Perform a post on an endpoint related item with ID. Ex.: endpoint/<itemId>/related?item=<relatedItemId>
   * @param objectId The item id
   * @param relatedItemId The related item Id
   * @param body The optional POST body
   * @return the RestResponse as an Observable
   */
  private postOnRelated(objectId: string, relatedItemId: string, body?: any) {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getIDHrefObs(objectId);

    hrefObs.pipe(
      take(1)
    ).subscribe((href: string) => {
      const request = new PostRequest(requestId, href + '/related?item=' + relatedItemId, body);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID<OpenaireBrokerEventObject>(requestId);
  }
}

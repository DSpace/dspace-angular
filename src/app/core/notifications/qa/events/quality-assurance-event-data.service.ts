import {
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaceOperation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  find,
  switchMap,
  take,
} from 'rxjs/operators';

import { QualityAssuranceEventData } from '../../../../notifications/qa/project-entry-import-modal/project-entry-import-modal.component';
import { hasValue } from '../../../../shared/empty.util';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { RequestParam } from '../../../cache/models/request-param.model';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import {
  CreateData,
  CreateDataImpl,
} from '../../../data/base/create-data';
import {
  DeleteData,
  DeleteDataImpl,
} from '../../../data/base/delete-data';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import {
  PatchData,
  PatchDataImpl,
} from '../../../data/base/patch-data';
import {
  SearchData,
  SearchDataImpl,
} from '../../../data/base/search-data';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { FindListOptions } from '../../../data/find-list-options.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { RemoteData } from '../../../data/remote-data';
import {
  DeleteByIDRequest,
  PostRequest,
} from '../../../data/request.models';
import { RequestService } from '../../../data/request.service';
import { HttpOptions } from '../../../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NoContent } from '../../../shared/NoContent.model';
import { QualityAssuranceEventObject } from '../models/quality-assurance-event.model';

/**
 * The service handling all Quality Assurance topic REST requests.
 */
@Injectable({ providedIn: 'root' })
export class QualityAssuranceEventDataService extends IdentifiableDataService<QualityAssuranceEventObject> {

  private createData: CreateData<QualityAssuranceEventObject>;
  private searchData: SearchData<QualityAssuranceEventObject>;
  private patchData: PatchData<QualityAssuranceEventObject>;
  private deleteData: DeleteData<QualityAssuranceEventObject>;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {DefaultChangeAnalyzer<QualityAssuranceEventObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected comparator: DefaultChangeAnalyzer<QualityAssuranceEventObject>,
  ) {
    super('qualityassuranceevents', requestService, rdbService, objectCache, halService);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.patchData = new PatchDataImpl<QualityAssuranceEventObject>(this.linkPath, requestService, rdbService, objectCache, halService, comparator, this.responseMsToLive, this.constructIdEndpoint);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
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
      new RequestParam('topic', topic),
    ];
    return this.searchData.searchBy('findByTopic', options, true, true, ...linksToFollow);
  }

  /**
   * Service for retrieving Quality Assurance events by topic and target.
   * @param options (Optional) The search options to use when retrieving the events.
   * @param linksToFollow (Optional) The links to follow when retrieving the events.
   * @returns An observable of the remote data containing the paginated list of Quality Assurance events.
   */
  public searchEventsByTopic(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<QualityAssuranceEventObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceEventObject>>> {
    return this.searchData.searchBy('findByTopic', options, true, true, ...linksToFollow);
  }

  /**
   * Clear findByTopic requests from cache
   */
  public clearFindByTopicRequests() {
    this.requestService.setStaleByHrefSubstring('findByTopic');
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
    return this.findById(id, true, true, ...linksToFollow);
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
        value: status,
      },
    ];
    return this.patchData.patch(dso, operation);
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
    return this.postOnRelated(itemId, projectId);
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

    return this.rdbService.buildFromRequestUUID<QualityAssuranceEventObject>(requestId);
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
      take(1),
    ).subscribe((href: string) => {
      const request = new PostRequest(requestId, href + '/related?item=' + relatedItemId, body);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID<QualityAssuranceEventObject>(requestId);
  }

  /**
   * Perform a post on an endpoint related to correction type
   * @param data the data to post
   * @returns the RestResponse as an Observable
   */
  postData(target: string, correctionType: string, related: string, reason: string): Observable<RemoteData<QualityAssuranceEventObject>> {
    const requestId = this.requestService.generateRequestId();
    const href$ = this.getBrowseEndpoint();

    return href$.pipe(
      switchMap((href: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        options.headers = headers;
        let params = new HttpParams();
        params = params.append('target', target)
          .append('correctionType', correctionType);
        options.params = params;
        const request = new PostRequest(requestId, href, { 'reason': reason } , options);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.send(request);
        return this.rdbService.buildFromRequestUUID<QualityAssuranceEventObject>(requestId);
      }),
    );
  }

  public deleteQAEvent(qaEvent: QualityAssuranceEventData): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(qaEvent.id);
  }

}

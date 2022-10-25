import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';


import { NotificationsService } from '../notifications/notifications.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { RequestParam } from '../../core/cache/models/request-param.model';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { DataService } from '../../core/data/data.service';
import { DSOChangeAnalyzer } from '../../core/data/dso-change-analyzer.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { CreateRequest, PutRequest } from '../../core/data/request.models';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { RestRequest } from '../../core/data/rest-request.model';

import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Subscription } from './models/subscription.model';
import { dataService } from '../../core/cache/builders/build-decorators';
import { SUBSCRIPTION } from './models/subscription.resource-type';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { NoContent } from '../../core/shared/NoContent.model';
import { isNotEmpty, isNotEmptyOperator } from '../empty.util';

import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { sendRequest } from 'src/app/core/shared/request.operators';

/**
 * Provides methods to retrieve subscription resources from the REST API related CRUD actions.
 */
@Injectable({
  providedIn: 'root'
})
@dataService(SUBSCRIPTION)
export class SubscriptionService extends DataService<Subscription> {
  protected linkPath = 'subscriptions';

  protected browseEndpoint = '';

  constructor(
    protected comparator: DSOChangeAnalyzer<Subscription>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected nameService: DSONameService,
  ) {
    super();
  }
  /**
   * Get subscriptions for a given item or community or collection & eperson.
   *
   * @param eperson The eperson to search for
   * @param uuid The uuid of the dsobjcet to search for
   */
  getSubscriptionByPersonDSO(eperson: string, uuid: string): Observable<PaginatedList<Subscription>> {

    const optionsWithObject = Object.assign(new FindListOptions(), {
      searchParams: [
        new RequestParam('dspace_object_id', uuid),
        new RequestParam('eperson_id', eperson)
      ]
    });

    return this.searchBy('findByEPersonAndDso', optionsWithObject, false, true).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Create a subscription for a given item or community or collection.
   *
   * @param subscription The subscription to create
   * @param eperson The eperson to create for
   * @param uuid The uuid of the dsobjcet to create for
   */
  createSubscription(subscription,eperson: string, uuid: string): Observable<RemoteData<Subscription>> {

    return this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      take(1),
      map((endpointUrl: string) => `${endpointUrl}?dspace_object_id=${uuid}&eperson_id=${eperson}`),
      map((endpointURL: string) => new CreateRequest(this.requestService.generateRequestId(), endpointURL, JSON.stringify(subscription))),
      sendRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.rdbService.buildFromRequestUUID(restRequest.uuid)),
      getFirstCompletedRemoteData(),
    ) as Observable<RemoteData<Subscription>>;
  }

  /**
   * Update a subscription for a given item or community or collection.
   *
   * @param subscription The subscription to update
   * @param eperson The eperson to update for
   * @param uuid The uuid of the dsobjcet to update for
   */
  updateSubscription(subscription,eperson: string, uuid: string) {

    return this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      take(1),
      map((endpointUrl: string) => `${endpointUrl}/${subscription.id}?dspace_object_id=${uuid}&eperson_id=${eperson}`),
      map((endpointURL: string) => new PutRequest(this.requestService.generateRequestId(), endpointURL, JSON.stringify(subscription))),
      sendRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.rdbService.buildFromRequestUUID(restRequest.uuid)),
      getFirstCompletedRemoteData(),
    ) as Observable<RemoteData<Subscription>>;
  }


  /**
   * Deletes the subscription with a give id
   *
   * @param id  the id of Subscription to delete
   */
  deleteSubscription( id: string ): Observable<RemoteData<NoContent>> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      switchMap((endpointUrl) => this.delete(id)),
      getFirstCompletedRemoteData(),
    );
  }

  /**
   * Retrieves the list of subscription with {@link dSpaceObject} and {@link ePerson}
   *
   * @param options                     options for the find all request
   */
  findAllSubscriptions(options?): Observable<PaginatedList<Subscription>> {
    const optionsWithObject = Object.assign(new FindListOptions(), options, {
      searchParams: [new RequestParam('embed', 'dSpaceObject'),new RequestParam('embed', 'ePerson')]
    });

    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      switchMap((endpointUrl) => this.findAllByHref(endpointUrl, optionsWithObject, false, true)),
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );

  }


  /**
   * Retrieves the list of subscription with {@link dSpaceObject} and {@link ePerson}
   *
   * @param options                     options for the find all request
   */
  findByEPerson(eperson,options?): Observable<PaginatedList<Subscription>> {
     const optionsWithObject = Object.assign(new FindListOptions(), options, {
      searchParams: [
      new RequestParam('id', eperson),
      new RequestParam('embed', 'dSpaceObject'),
      new RequestParam('embed', 'ePerson')
      ]
    });

    const endpoint = this.getSearchEndpoint('findByEPerson');

    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      switchMap((endpointUrl) => this.findAllByHref(endpoint, optionsWithObject, false, true)),
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }

}

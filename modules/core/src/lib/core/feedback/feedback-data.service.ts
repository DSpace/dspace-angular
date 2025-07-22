import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  ObjectCacheService,
  RemoteDataBuildService,
  RequestParam,
} from '../cache';
import {
  CreateData,
  CreateDataImpl,
  IdentifiableDataService,
  RemoteData,
  RequestService,
} from '../data';
import { NotificationsService } from '../notifications';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
  HALEndpointService,
} from '../shared';
import { Feedback } from './models';

/**
 * Service for checking and managing the feedback
 */
@Injectable({ providedIn: 'root' })
export class FeedbackDataService extends IdentifiableDataService<Feedback> implements CreateData<Feedback> {
  private createData: CreateDataImpl<Feedback>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('feedbacks', requestService, rdbService, objectCache, halService);

    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
  }

  /**
   * Get feedback from its id
   * @param uuid string the id of the feedback
   */
  getFeedback(uuid: string): Observable<Feedback> {
    return this.findById(uuid).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }


  /**
   * Create a new object on the server, and store the response in the object cache
   *
   * @param object    The object to create
   * @param params    Array with additional params to combine with query string
   */
  public create(object: Feedback, ...params: RequestParam[]): Observable<RemoteData<Feedback>> {
    return this.createData.create(object, ...params);
  }
}

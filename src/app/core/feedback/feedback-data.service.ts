import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  find,
  map,
  Observable,
} from 'rxjs';
import { hasValue } from 'src/app/shared/empty.util';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import {
  CreateData,
  CreateDataImpl,
} from '../data/base/create-data';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { RemoteData } from '../data/remote-data';
import { PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../shared/operators';
import { Feedback } from './models/feedback.model';

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

  /**
   * Creates a new object on the server, and stores the response in the object cache, checks if the request is sent with recaptcha token
   *
   * @param object    The object to create
   * @param captchaToken ReCaptchaToken if the verification is enabled
   */
  public registerFeedback(object: Feedback, captchaToken: string = null): Observable<RemoteData<Feedback>> {
    let headers = new HttpHeaders();
    const options: HttpOptions = Object.create({});
    if (captchaToken) {
      headers = headers.append('X-Recaptcha-Token', captchaToken);
    }
    options.headers = headers;
    const requestId = this.requestService.generateRequestId();


    this.getEndpoint().pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, object, options);
        this.requestService.send(request);
      }),
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<Feedback>(requestId).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}

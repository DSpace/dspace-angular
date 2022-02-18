import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import {
  AddTopicsAction,
  NotificationsBrokerTopicActionTypes,
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction,
} from './notifications-broker-topics.actions';

import { NotificationsBrokerTopicObject } from '../../../core/notifications/broker/models/notifications-broker-topic.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerTopicsService } from './notifications-broker-topics.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsBrokerTopicRestService } from '../../../core/notifications/broker/topics/notifications-broker-topic-rest.service';

/**
 * Provides effect methods for the Notifications Broker topics actions.
 */
@Injectable()
export class NotificationsBrokerTopicsEffects {

  /**
   * Retrieve all Notifications Broker topics managing pagination and errors.
   */
  @Effect() retrieveAllTopics$ = this.actions$.pipe(
    ofType(NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllTopicsAction, any]) => {
      return this.notificationsBrokerTopicService.getTopics(
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((topics: PaginatedList<NotificationsBrokerTopicObject>) =>
          new AddTopicsAction(topics.page, topics.totalPages, topics.currentPage, topics.totalElements)
        ),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RetrieveAllTopicsErrorAction());
        })
      );
    })
  );

  /**
   * Show a notification on error.
   */
  @Effect({ dispatch: false }) retrieveAllTopicsErrorAction$ = this.actions$.pipe(
    ofType(NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('notifications.broker.topic.error.service.retrieve'));
    })
  );

  /**
   * Clear find all topics requests from cache.
   */
  @Effect({ dispatch: false }) addTopicsAction$ = this.actions$.pipe(
    ofType(NotificationsBrokerTopicActionTypes.ADD_TOPICS),
    tap(() => {
      this.notificationsBrokerTopicDataService.clearFindAllTopicsRequests();
    })
  );

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {NotificationsBrokerTopicsService} notificationsBrokerTopicService
   * @param {NotificationsBrokerTopicRestService} notificationsBrokerTopicDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private notificationsBrokerTopicService: NotificationsBrokerTopicsService,
    private notificationsBrokerTopicDataService: NotificationsBrokerTopicRestService
  ) { }
}

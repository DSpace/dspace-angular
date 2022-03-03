import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import {
 AddSourceAction,
 NotificationsBrokerSourceActionTypes,
 RetrieveAllSourceAction,
 RetrieveAllSourceErrorAction,
} from './notifications-broker-source.actions';

import { NotificationsBrokerSourceObject } from '../../../core/notifications/broker/models/notifications-broker-source.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerSourceService } from './notifications-broker-source.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsBrokerSourceRestService } from '../../../core/notifications/broker/source/notifications-broker-source-rest.service';

/**
 * Provides effect methods for the Notifications Broker source actions.
 */
@Injectable()
export class NotificationsBrokerSourceEffects {

  /**
   * Retrieve all Notifications Broker source managing pagination and errors.
   */
  @Effect() retrieveAllSource$ = this.actions$.pipe(
    ofType(NotificationsBrokerSourceActionTypes.RETRIEVE_ALL_SOURCE),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllSourceAction, any]) => {
      return this.notificationsBrokerSourceService.getSources(
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((sources: PaginatedList<NotificationsBrokerSourceObject>) =>
          new AddSourceAction(sources.page, sources.totalPages, sources.currentPage, sources.totalElements)
        ),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RetrieveAllSourceErrorAction());
        })
      );
    })
  );

  /**
   * Show a notification on error.
   */
  @Effect({ dispatch: false }) retrieveAllSourceErrorAction$ = this.actions$.pipe(
    ofType(NotificationsBrokerSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('notifications.broker.source.error.service.retrieve'));
    })
  );

  /**
   * Clear find all source requests from cache.
   */
  @Effect({ dispatch: false }) addSourceAction$ = this.actions$.pipe(
    ofType(NotificationsBrokerSourceActionTypes.ADD_SOURCE),
    tap(() => {
      this.notificationsBrokerSourceDataService.clearFindAllSourceRequests();
    })
  );

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {NotificationsBrokerSourceService} notificationsBrokerSourceService
   * @param {NotificationsBrokerSourceRestService} notificationsBrokerSourceDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private notificationsBrokerSourceService: NotificationsBrokerSourceService,
    private notificationsBrokerSourceDataService: NotificationsBrokerSourceRestService
  ) { }
}

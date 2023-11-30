import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import {
  AddTopicsAction,
  OpenaireBrokerTopicActionTypes,
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction,
} from './openaire-broker-topics.actions';

import { OpenaireBrokerTopicObject } from '../../../core/openaire/broker/models/openaire-broker-topic.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { OpenaireBrokerTopicsService } from './openaire-broker-topics.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { OpenaireBrokerTopicRestService } from '../../../core/openaire/broker/topics/openaire-broker-topic-rest.service';

/**
 * Provides effect methods for the OpenAIRE Broker topics actions.
 */
@Injectable()
export class OpenaireBrokerTopicsEffects {

  /**
   * Retrieve all OpenAIRE Broker topics managing pagination and errors.
   */
  retrieveAllTopics$ = createEffect(() => this.actions$.pipe(
    ofType(OpenaireBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllTopicsAction, any]) => {
      return this.openaireBrokerTopicService.getTopics(
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((topics: PaginatedList<OpenaireBrokerTopicObject>) =>
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
  ));

  /**
   * Show a notification on error.
   */
  retrieveAllTopicsErrorAction$ = createEffect(() => this.actions$.pipe(
    ofType(OpenaireBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('openaire.broker.topic.error.service.retrieve'));
    })
  ), { dispatch: false });

  /**
   * Clear find all topics requests from cache.
   */
  addTopicsAction$ = createEffect(() => this.actions$.pipe(
    ofType(OpenaireBrokerTopicActionTypes.ADD_TOPICS),
    tap(() => {
      this.openaireBrokerTopicDataService.clearFindAllTopicsRequests();
    })
  ), { dispatch: false });

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {OpenaireBrokerTopicsService} openaireBrokerTopicService
   * @param {OpenaireBrokerTopicRestService} openaireBrokerTopicDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private openaireBrokerTopicService: OpenaireBrokerTopicsService,
    private openaireBrokerTopicDataService: OpenaireBrokerTopicRestService
  ) { }
}

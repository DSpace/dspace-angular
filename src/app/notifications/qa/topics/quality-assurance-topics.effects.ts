import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { QualityAssuranceTopicObject } from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import { QualityAssuranceTopicDataService } from '../../../core/notifications/qa/topics/quality-assurance-topic-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  AddTopicsAction,
  QualityAssuranceTopicActionTypes,
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction,
} from './quality-assurance-topics.actions';
import { QualityAssuranceTopicsService } from './quality-assurance-topics.service';

/**
 * Provides effect methods for the Quality Assurance topics actions.
 */
@Injectable()
export class QualityAssuranceTopicsEffects {

  /**
   * Retrieve all Quality Assurance topics managing pagination and errors.
   */
  retrieveAllTopics$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllTopicsAction, any]) => {
      return this.qualityAssuranceTopicService.getTopics(
        action.payload.elementsPerPage,
        action.payload.currentPage,
        action.payload.source,
        action.payload.target,
      ).pipe(
        map((topics: PaginatedList<QualityAssuranceTopicObject>) =>
          new AddTopicsAction(topics.page, topics.totalPages, topics.currentPage, topics.totalElements),
        ),
        catchError((error: unknown) => {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('Unexpected object thrown', error);
          }
          return of(new RetrieveAllTopicsErrorAction());
        }),
      );
    }),
  ));

  /**
   * Show a notification on error.
   */
  retrieveAllTopicsErrorAction$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('quality-assurance.topic.error.service.retrieve'));
    }),
  ), { dispatch: false });

  /**
   * Clear find all topics requests from cache.
   */
  addTopicsAction$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceTopicActionTypes.ADD_TOPICS),
    tap(() => {
      this.qualityAssuranceTopicDataService.clearFindAllTopicsRequests();
    }),
  ), { dispatch: false });

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {QualityAssuranceTopicsService} qualityAssuranceTopicService
   * @param {QualityAssuranceTopicDataService} qualityAssuranceTopicDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private qualityAssuranceTopicService: QualityAssuranceTopicsService,
    private qualityAssuranceTopicDataService: QualityAssuranceTopicDataService,
  ) { }
}

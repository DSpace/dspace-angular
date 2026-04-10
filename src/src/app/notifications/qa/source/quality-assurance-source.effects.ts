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
import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceSourceDataService } from '../../../core/notifications/qa/source/quality-assurance-source-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  AddSourceAction,
  QualityAssuranceSourceActionTypes,
  RetrieveAllSourceAction,
  RetrieveAllSourceErrorAction,
} from './quality-assurance-source.actions';
import { QualityAssuranceSourceService } from './quality-assurance-source.service';

/**
 * Provides effect methods for the Quality Assurance source actions.
 */
@Injectable()
export class QualityAssuranceSourceEffects {

  /**
   * Retrieve all Quality Assurance source managing pagination and errors.
   */
  retrieveAllSource$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllSourceAction, any]) => {
      return this.qualityAssuranceSourceService.getSources(
        action.payload.elementsPerPage,
        action.payload.currentPage,
      ).pipe(
        map((sources: PaginatedList<QualityAssuranceSourceObject>) =>
          new AddSourceAction(sources.page, sources.totalPages, sources.currentPage, sources.totalElements),
        ),
        catchError((error: unknown) => {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('Unexpected object thrown', error);
          }
          return of(new RetrieveAllSourceErrorAction());
        }),
      );
    }),
  ));

  /**
   * Show a notification on error.
   */
  retrieveAllSourceErrorAction$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('quality-assurance.source.error.service.retrieve'));
    }),
  ), { dispatch: false });

  /**
   * Clear find all source requests from cache.
   */
  addSourceAction$ = createEffect(() => this.actions$.pipe(
    ofType(QualityAssuranceSourceActionTypes.ADD_SOURCE),
    tap(() => {
      this.qualityAssuranceSourceDataService.clearFindAllSourceRequests();
    }),
  ), { dispatch: false });

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {QualityAssuranceSourceService} qualityAssuranceSourceService
   * @param {QualityAssuranceSourceDataService} qualityAssuranceSourceDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private qualityAssuranceSourceService: QualityAssuranceSourceService,
    private qualityAssuranceSourceDataService: QualityAssuranceSourceDataService,
  ) {
  }
}

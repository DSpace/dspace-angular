import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import {
 AddSourceAction,
 QualityAssuranceSourceActionTypes,
 RetrieveAllSourceAction,
 RetrieveAllSourceErrorAction,
} from './quality-assurance-source.actions';

import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { QualityAssuranceSourceService } from './quality-assurance-source.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { QualityAssuranceSourceRestService } from '../../../core/notifications/qa/source/quality-assurance-source-rest.service';

/**
 * Provides effect methods for the Quality Assurance source actions.
 */
@Injectable()
export class QualityAssuranceSourceEffects {

  /**
   * Retrieve all Quality Assurance source managing pagination and errors.
   */
  @Effect() retrieveAllSource$ = this.actions$.pipe(
    ofType(QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [RetrieveAllSourceAction, any]) => {
      return this.qualityAssuranceSourceService.getSources(
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((sources: PaginatedList<QualityAssuranceSourceObject>) =>
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
    ofType(QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('quality-assurance.source.error.service.retrieve'));
    })
  );

  /**
   * Clear find all source requests from cache.
   */
  @Effect({ dispatch: false }) addSourceAction$ = this.actions$.pipe(
    ofType(QualityAssuranceSourceActionTypes.ADD_SOURCE),
    tap(() => {
      this.qualityAssuranceSourceDataService.clearFindAllSourceRequests();
    })
  );

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {QualityAssuranceSourceService} qualityAssuranceSourceService
   * @param {QualityAssuranceSourceRestService} qualityAssuranceSourceDataService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private qualityAssuranceSourceService: QualityAssuranceSourceService,
    private qualityAssuranceSourceDataService: QualityAssuranceSourceRestService
  ) { }
}

import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  AddTargetAction,
  AddUserSuggestionsAction,
  RetrieveAllTargetsErrorAction,
  RetrieveTargetsBySourceAction,
  SuggestionTargetActionTypes,
} from './suggestion-targets.actions';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SuggestionsService } from '../suggestions.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SuggestionTarget } from '../../core/suggestion-notifications/models/suggestion-target.model';

/**
 * Provides effect methods for the Suggestion Targets actions.
 */
@Injectable()
export class SuggestionTargetsEffects {

  /**
   * Retrieve all Suggestion Targets managing pagination and errors.
   */
  retrieveTargetsBySource$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE),
    switchMap((action: RetrieveTargetsBySourceAction) => {
      return this.suggestionsService.getTargets(
        action.payload.source,
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((targets: PaginatedList<SuggestionTarget>) =>
          new AddTargetAction(targets.page, targets.totalPages, targets.currentPage, targets.totalElements)
        ),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return of(new RetrieveAllTargetsErrorAction());
        })
      );
    })
  ));

  /**
   * Show a notification on error.
   */
  retrieveAllTargetsErrorAction$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('suggestion.target.error.service.retrieve'));
    })
  ), { dispatch: false });

  /**
   * Fetch the current user suggestion
   */
  refreshUserSuggestionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.REFRESH_USER_SUGGESTIONS),
    switchMap(() => {
      return this.store$.select((state: any) => state.core.auth.userId)
        .pipe(
          switchMap((userId: string) => {
            return this.suggestionsService.retrieveCurrentUserSuggestions(userId)
              .pipe(
                map((suggestionTargets: SuggestionTarget[]) => new AddUserSuggestionsAction(suggestionTargets)),
                catchError((errors) => of(errors))
            );
          }),
          catchError((errors) => of(errors))
        );
    }))
  );

  /**
   * Initialize the effect class variables.
   * @param {Actions} actions$
   * @param {Store<any>} store$
   * @param {TranslateService} translate
   * @param {NotificationsService} notificationsService
   * @param {SuggestionsService} suggestionsService
   */
  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private suggestionsService: SuggestionsService
  ) {
  }
}

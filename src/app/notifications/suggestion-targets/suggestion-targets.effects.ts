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
} from 'rxjs/operators';

import {
  AuthActionTypes,
  RetrieveAuthenticatedEpersonSuccessAction,
} from '../../core/auth/auth.actions';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SuggestionTarget } from '../../core/notifications/suggestions/models/suggestion-target.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SuggestionsService } from '../suggestions.service';
import {
  AddTargetAction,
  AddUserSuggestionsAction,
  RefreshUserSuggestionsErrorAction,
  RetrieveTargetsBySourceAction,
  RetrieveTargetsBySourceErrorAction,
  SuggestionTargetActionTypes,
} from './suggestion-targets.actions';

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
        action.payload.currentPage,
      ).pipe(
        map((targets: PaginatedList<SuggestionTarget>) =>
          new AddTargetAction(action.payload.source, targets.page, targets.totalPages, targets.currentPage, targets.totalElements),
        ),
        catchError((error: unknown) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          return of(new RetrieveTargetsBySourceErrorAction(action.payload.source));
        }),
      );
    }),
  ));

  /**
   * Show a notification on error.
   */
  retrieveAllTargetsErrorAction$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('suggestion.target.error.service.retrieve'));
    }),
  ), { dispatch: false });

  /**
   * Show a notification on error.
   */
  retrieveUserTargets$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.RETRIEVE_AUTHENTICATED_EPERSON_SUCCESS),
    switchMap((action: RetrieveAuthenticatedEpersonSuccessAction) => {
      return this.suggestionsService.retrieveCurrentUserSuggestions(action.payload).pipe(
        map((suggestionTargets: SuggestionTarget[]) => new AddUserSuggestionsAction(suggestionTargets)),
      );
    })));

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
                catchError((error: unknown) => {
                  if (error instanceof Error) {
                    console.error(error.message);
                  }
                  return of(new RefreshUserSuggestionsErrorAction());
                }),
              );
          }),
          catchError((error: unknown) => {
            if (error instanceof Error) {
              console.error(error.message);
            }
            return of(new RefreshUserSuggestionsErrorAction());
          }),
        );
    })),
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
    private suggestionsService: SuggestionsService,
  ) {
  }
}

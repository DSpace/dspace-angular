import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import {
  AddTargetAction,
  AddUserSuggestionsAction,
  RefreshUserSuggestionsAction,
  RetrieveAllTargetsErrorAction,
  RetrieveTargetsBySourceAction,
  SuggestionTargetActionTypes,
} from './suggestion-targets.actions';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { SuggestionsService } from '../suggestions.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { AuthActionTypes, RetrieveAuthenticatedEpersonSuccessAction } from '../../../core/auth/auth.actions';
import { OpenaireSuggestionTarget } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { of } from 'rxjs/internal/observable/of';

/**
 * Provides effect methods for the Suggestion Targets actions.
 */
@Injectable()
export class SuggestionTargetsEffects {

  /**
   * Retrieve all Suggestion Targets managing pagination and errors.
   */
  @Effect() retrieveTargetsBySource$ = this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE),
    switchMap((action: RetrieveTargetsBySourceAction) => {
      return this.suggestionsService.getTargets(
        action.payload.source,
        action.payload.elementsPerPage,
        action.payload.currentPage
      ).pipe(
        map((targets: PaginatedList<OpenaireSuggestionTarget>) =>
          new AddTargetAction(targets.page, targets.totalPages, targets.currentPage, targets.totalElements)
        ),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RetrieveAllTargetsErrorAction());
        })
      );
    })
  );

  /**
   * Show a notification on error.
   */
  @Effect({ dispatch: false }) retrieveAllTargetsErrorAction$ = this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('reciter.suggestion.target.error.service.retrieve'));
    })
  );

  /**
   * Show a notification on error.
   */
  @Effect() retrieveUserTargets$ = this.actions$.pipe(
    ofType(AuthActionTypes.RETRIEVE_AUTHENTICATED_EPERSON_SUCCESS),
    switchMap((action: RetrieveAuthenticatedEpersonSuccessAction) => {
      return this.suggestionsService.retrieveCurrentUserSuggestions(action.payload).pipe(
        map((suggestionTargets: OpenaireSuggestionTarget[]) => new AddUserSuggestionsAction(suggestionTargets))
      );
    }));

  /**
   * Fetch the current user suggestion
   */
  @Effect() refreshUserTargets$ = this.actions$.pipe(
    ofType(SuggestionTargetActionTypes.REFRESH_USER_SUGGESTIONS),
    switchMap((action: RefreshUserSuggestionsAction) => {
      return this.store$.select((state: any) => state.core.auth.user)
        .pipe(
          switchMap((user: EPerson) => {
            return this.suggestionsService.retrieveCurrentUserSuggestions(user)
              .pipe(
                map((suggestionTargets: OpenaireSuggestionTarget[]) => new AddUserSuggestionsAction(suggestionTargets)),
                catchError((errors) => of(errors))
            );
          }),
          catchError((errors) => of(errors))
        );
    }));

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

import { Injectable } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuggestionTarget } from '../../core/notifications/models/suggestion-target.model';
import { SuggestionNotificationsState } from '../../notifications/notifications.reducer';
import {
  getCurrentUserSuggestionTargetsSelector,
  getCurrentUserSuggestionTargetsVisitedSelector,
  getSuggestionTargetCurrentPageSelector,
  getSuggestionTargetTotalsSelector,
  isReciterSuggestionTargetProcessingSelector,
  isSuggestionTargetLoadedSelector,
  suggestionTargetObjectSelector,
} from '../../suggestion-notifications/selectors';
import {
  ClearSuggestionTargetsAction,
  MarkUserSuggestionsAsVisitedAction,
  RefreshUserSuggestionsAction,
  RetrieveTargetsBySourceAction,
} from './suggestion-targets.actions';

/**
 * The service handling the Suggestion targets State.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionTargetsStateService {

  /**
   * Initialize the service variables.
   * @param {Store<SuggestionNotificationsState>} store
   */
  constructor(private store: Store<SuggestionNotificationsState>) { }

  /**
   * Returns the list of Suggestion Targets from the state.
   *
   * @return Observable<SuggestionTarget>
   *    The list of Suggestion Targets.
   */
  public getSuggestionTargets(): Observable<SuggestionTarget[]> {
    return this.store.pipe(select(suggestionTargetObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loading, 'false' otherwise.
   */
  public isSuggestionTargetsLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isSuggestionTargetLoadedSelector),
      map((loaded: boolean) => !loaded),
    );
  }

  /**
   * Returns the information about the loading status of the Suggestion Targets (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loaded, 'false' otherwise.
   */
  public isSuggestionTargetsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isSuggestionTargetLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isSuggestionTargetsProcessing(): Observable<boolean> {
    return this.store.pipe(select(isReciterSuggestionTargetProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Suggestion Targets pages.
   */
  public getSuggestionTargetsTotalPages(): Observable<number> {
    return this.store.pipe(select(getSuggestionTargetTotalsSelector));
  }

  /**
   * Returns the current page of the Suggestion Targets, from the state.
   *
   * @return Observable<number>
   *    The number of the current Suggestion Targets page.
   */
  public getSuggestionTargetsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getSuggestionTargetCurrentPageSelector));
  }

  /**
   * Returns the total number of the Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Suggestion Targets.
   */
  public getSuggestionTargetsTotals(): Observable<number> {
    return this.store.pipe(select(getSuggestionTargetTotalsSelector));
  }

  /**
   * Dispatch a request to change the Suggestion Targets state, retrieving the targets from the server.
   *
   * @param source
   *    the source for which to retrieve suggestion targets
   * @param elementsPerPage
   *    The number of the targets per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveSuggestionTargets(source: string, elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveTargetsBySourceAction(source, elementsPerPage, currentPage));
  }

  /**
   * Returns, from the state, the suggestion targets for the current user.
   *
   * @return Observable<OpenaireReciterSuggestionTarget>
   *    The Suggestion Targets object.
   */
  public getCurrentUserSuggestionTargets(): Observable<SuggestionTarget[]> {
    return this.store.pipe(select(getCurrentUserSuggestionTargetsSelector));
  }

  /**
   * Returns, from the state, whether or not the user has consulted their suggestion targets.
   *
   * @return Observable<boolean>
   *    True if user already visited, false otherwise.
   */
  public hasUserVisitedSuggestions(): Observable<boolean> {
    return this.store.pipe(select(getCurrentUserSuggestionTargetsVisitedSelector));
  }

  /**
   * Dispatch a new MarkUserSuggestionsAsVisitedAction
   */
  public dispatchMarkUserSuggestionsAsVisitedAction(): void {
    this.store.dispatch(new MarkUserSuggestionsAsVisitedAction());
  }

  /**
   * Dispatch an action to clear the Reciter Suggestion Targets state.
   */
  public dispatchClearSuggestionTargetsAction(): void {
    this.store.dispatch(new ClearSuggestionTargetsAction());
  }

  /**
   * Dispatch an action to refresh the user suggestions.
   */
  public dispatchRefreshUserSuggestionsAction(): void {
    this.store.dispatch(new RefreshUserSuggestionsAction());
  }
}

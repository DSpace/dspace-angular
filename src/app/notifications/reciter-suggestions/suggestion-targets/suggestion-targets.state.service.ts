import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  getCurrentUserSuggestionTargetsSelector,
  getCurrentUserSuggestionTargetsVisitedSelector,
  getReciterSuggestionTargetCurrentPageSelector,
  getReciterSuggestionTargetTotalsSelector,
  isReciterSuggestionTargetLoadedSelector,
  isReciterSuggestionTargetProcessingSelector,
  reciterSuggestionTargetObjectSelector
} from '../selectors';
import { SuggestionTarget } from '../../../core/notifications/reciter-suggestions/models/suggestion-target.model';
import {
  ClearSuggestionTargetsAction,
  MarkUserSuggestionsAsVisitedAction,
  RefreshUserSuggestionsAction,
  RetrieveTargetsBySourceAction
} from './suggestion-targets.actions';
import { SuggestionNotificationsState } from '../../notifications.reducer';

/**
 * The service handling the Suggestion targets State.
 */
@Injectable()
export class SuggestionTargetsStateService {

  /**
   * Initialize the service variables.
   * @param {Store<SuggestionNotificationsState>} store
   */
  constructor(private store: Store<SuggestionNotificationsState>) { }

  /**
   * Returns the list of Reciter Suggestion Targets from the state.
   *
   * @return Observable<OpenaireReciterSuggestionTarget>
   *    The list of Reciter Suggestion Targets.
   */
  public getReciterSuggestionTargets(): Observable<SuggestionTarget[]> {
    return this.store.pipe(select(reciterSuggestionTargetObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Reciter Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loading, 'false' otherwise.
   */
  public isReciterSuggestionTargetsLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isReciterSuggestionTargetLoadedSelector),
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Returns the information about the loading status of the Reciter Suggestion Targets (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loaded, 'false' otherwise.
   */
  public isReciterSuggestionTargetsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isReciterSuggestionTargetLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Reciter Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isReciterSuggestionTargetsProcessing(): Observable<boolean> {
    return this.store.pipe(select(isReciterSuggestionTargetProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Reciter Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Reciter Suggestion Targets pages.
   */
  public getReciterSuggestionTargetsTotalPages(): Observable<number> {
    return this.store.pipe(select(getReciterSuggestionTargetTotalsSelector));
  }

  /**
   * Returns the current page of the Reciter Suggestion Targets, from the state.
   *
   * @return Observable<number>
   *    The number of the current Reciter Suggestion Targets page.
   */
  public getReciterSuggestionTargetsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getReciterSuggestionTargetCurrentPageSelector));
  }

  /**
   * Returns the total number of the Reciter Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Reciter Suggestion Targets.
   */
  public getReciterSuggestionTargetsTotals(): Observable<number> {
    return this.store.pipe(select(getReciterSuggestionTargetTotalsSelector));
  }

  /**
   * Dispatch a request to change the Reciter Suggestion Targets state, retrieving the targets from the server.
   *
   * @param source
   *    the source for which to retrieve suggestion targets
   * @param elementsPerPage
   *    The number of the targets per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveReciterSuggestionTargets(source: string, elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveTargetsBySourceAction(source, elementsPerPage, currentPage));
  }

  /**
   * Returns, from the state, the reciter suggestion targets for the current user.
   *
   * @return Observable<OpenaireReciterSuggestionTarget>
   *    The Reciter Suggestion Targets object.
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

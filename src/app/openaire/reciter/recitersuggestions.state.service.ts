import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getreciterSuggestionTargetCurrentPageSelector,
  getreciterSuggestionTargetTotalPagesSelector,
  getreciterSuggestionTargetTotalsSelector,
  isReciterSuggestionTargetLoadedSelector,
  isreciterSuggestionTargetProcessingSelector,
  reciterSuggestionTargetObjectSelector
} from './selectors';
import { SuggestionTargetObject } from '../../core/openaire/reciter-suggestions/models/suggestion-target.model';
import { RetrieveAllTargetsAction } from './suggestion-target/suggestion-target.actions';
import { OpenaireState } from '../openaire.reducer';

/**
 * The service handling the Reciter Suggestion State.
 */
@Injectable()
export class ReciterSuggestionStateService {

  /**
   * Initialize the service variables.
   * @param {Store<OpenaireState>} store
   */
  constructor(private store: Store<OpenaireState>) { }

  // Reciter Suggestion Targets
  // --------------------------------------------------------------------------

  /**
   * Returns the list of Reciter Suggestion Targets from the state.
   *
   * @return Observable<SuggestionTargetObject>
   *    The list of Reciter Suggestion Targets.
   */
  public getReciterSuggestionTargets(): Observable<SuggestionTargetObject[]> {
    return this.store.pipe(select(reciterSuggestionTargetObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Reciter Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
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
   *    'true' if the topics are loaded, 'false' otherwise.
   */
  public isReciterSuggestionTargetsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isReciterSuggestionTargetLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Reciter Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isReciterSuggestionTargetsProcessing(): Observable<boolean> {
    return this.store.pipe(select(isreciterSuggestionTargetProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Reciter Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Reciter Suggestion Targets pages.
   */
  public getReciterSuggestionTargetsTotalPages(): Observable<number> {
    return this.store.pipe(select(getreciterSuggestionTargetTotalsSelector));
  }

  /**
   * Returns the current page of the Reciter Suggestion Targets, from the state.
   *
   * @return Observable<number>
   *    The number of the current Reciter Suggestion Targets page.
   */
  public getReciterSuggestionTargetsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getreciterSuggestionTargetCurrentPageSelector))
  }

  /**
   * Returns the total number of the Reciter Suggestion Targets.
   *
   * @return Observable<number>
   *    The number of the Reciter Suggestion Targets.
   */
  public getReciterSuggestionTargetsTotals(): Observable<number> {
    return this.store.pipe(select(getreciterSuggestionTargetTotalPagesSelector))
  }

  /**
   * Dispatch a request to change the Reciter Suggestion Targets state, retrieving the topics from the server.
   *
   * @param elementsPerPage
   *    The number of the targets per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveReciterSuggestionTargets(elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveAllTargetsAction(elementsPerPage, currentPage))
  }
}

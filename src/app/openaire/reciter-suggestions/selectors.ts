import { createSelector, MemoizedSelector } from '@ngrx/store';
import { subStateSelector } from '../../shared/selector.util';
import { openaireSelector, OpenaireState } from '../openaire.reducer';
import { OpenaireSuggestionTarget } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { SuggestionTargetState } from './suggestion-targets/suggestion-targets.reducer';

/**
 * Returns the Reciter Suggestion Target state.
 * @function _getReciterSuggestionTargetState
 * @param {AppState} state Top level state.
 * @return {OpenaireState}
 */
const _getReciterSuggestionTargetState = (state: any) => state.openaire;

// Reciter Suggestion Targets
// ----------------------------------------------------------------------------

/**
 * Returns the Reciter Suggestion Targets State.
 * @function reciterSuggestionTargetStateSelector
 * @return {OpenaireState}
 */
export function reciterSuggestionTargetStateSelector(): MemoizedSelector<OpenaireState, SuggestionTargetState> {
  return subStateSelector<OpenaireState, SuggestionTargetState>(openaireSelector, 'suggestionTarget');
}

/**
 * Returns the Reciter Suggestion Targets list.
 * @function reciterSuggestionTargetObjectSelector
 * @return {OpenaireReciterSuggestionTarget[]}
 */
export function reciterSuggestionTargetObjectSelector(): MemoizedSelector<OpenaireState, OpenaireSuggestionTarget[]> {
  return subStateSelector<OpenaireState, OpenaireSuggestionTarget[]>(reciterSuggestionTargetStateSelector(), 'targets');
}

/**
 * Returns true if the Reciter Suggestion Targets are loaded.
 * @function isReciterSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetLoadedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isreciterSuggestionTargetProcessingSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.processing
);

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalPagesSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.totalPages
);

/**
 * Returns the current page of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getreciterSuggestionTargetCurrentPageSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.currentPage
);

/**
 * Returns the total number of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.totalElements
);

/**
 * Returns Suggestion Targets for the current user.
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {OpenaireSuggestionTarget[]}
 */
export const getCurrentUserSuggestionTargetsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.currentUserTargets
);

/**
 * Returns whether or not the user has consulted their suggestions
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {boolean}
 */
export const getCurrentUserSuggestionTargetsVisitedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => state.suggestionTarget.currentUserTargetsVisited
);

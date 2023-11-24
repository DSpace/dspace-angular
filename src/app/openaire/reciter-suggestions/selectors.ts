import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import {subStateSelector} from '../../shared/selector.util';
import {openaireSelector, OpenaireState} from '../openaire.reducer';
import {
	OpenaireSuggestionTarget
} from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import {SuggestionTargetState} from './suggestion-targets/suggestion-targets.reducer';

/**
 * Returns the Reciter Suggestion Target state.
 * @function _getReciterSuggestionTargetState
 * @param {AppState} state Top level state.
 * @return {OpenaireState}
 */
const _getReciterSuggestionTargetState = createFeatureSelector<OpenaireState>('openaire');

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
export function reciterSuggestionTargetObjectSelector(source: string): MemoizedSelector<OpenaireState, OpenaireSuggestionTarget[]> {
  return createSelector(reciterSuggestionTargetStateSelector(),
    (state: SuggestionTargetState) => state[source]?.targets);
}

/**
 * Returns true if the Reciter Suggestion Targets are loaded.
 * @function isReciterSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetLoadedSelector = (source: string) => {
  return createSelector(_getReciterSuggestionTargetState, (state: OpenaireState) => {
    const loaded = state.suggestionTarget[source]?.loaded;
    return loaded || false;
  });
};

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isreciterSuggestionTargetProcessingSelector = (source: string) => {
  return createSelector(_getReciterSuggestionTargetState, (state: OpenaireState) => {
    const processing = state.suggestionTarget[source]?.processing;
    return processing || false;
  });
};

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalPagesSelector = (source: string) => {
  return createSelector(_getReciterSuggestionTargetState, (state: OpenaireState) => state.suggestionTarget[source]?.totalPages);
};

/**
 * Returns the current page of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getreciterSuggestionTargetCurrentPageSelector = (source: string) => {
  return createSelector(_getReciterSuggestionTargetState, (state: OpenaireState) => state.suggestionTarget[source]?.currentPage);
};

/**
 * Returns the total number of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalsSelector = (source: string) => {
  return createSelector(_getReciterSuggestionTargetState, (state: OpenaireState) => state.suggestionTarget[source]?.totalElements);
};

/**
 * Returns Suggestion Targets for the current user.
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {OpenaireSuggestionTarget[]}
 */
export const getCurrentUserSuggestionTargetsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) => {
    const suggestionTargetValues = Object.values(state.suggestionTarget);
    return suggestionTargetValues.reduce(
      (acc, entry) => acc.concat(entry?.currentUserTargets || []),
      []);
  }
);

/**
 * Returns whether or not the user has consulted their suggestions
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {boolean}
 */
export const getCurrentUserSuggestionTargetsVisitedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: OpenaireState) =>  {
    const suggestionTargetValues = Object.values(state.suggestionTarget);
    return suggestionTargetValues.some(
      (entry) => entry?.currentUserTargetsVisited === true);
  }
);

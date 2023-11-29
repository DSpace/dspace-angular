import { createSelector, MemoizedSelector } from '@ngrx/store';
import { subStateSelector } from '../../shared/selector.util';
import { openaireSelector, OpenaireState } from '../openaire.reducer';
import {
  OpenaireSuggestionTarget
} from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { SuggestionTargetEntry, SuggestionTargetState } from './suggestion-targets/suggestion-targets.reducer';

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
 * Returns the Reciter Suggestion source state
 * @function reciterSuggestionTargetObjectSelector
 * @return {SuggestionTargetEntry}
 */
export function reciterSuggestionSourceSelector(source: string): MemoizedSelector<OpenaireState, SuggestionTargetEntry> {
  return createSelector(reciterSuggestionTargetStateSelector(),(state: SuggestionTargetState) => state.sources[source]);
}

/**
 * Returns the Reciter Suggestion Targets list by source.
 * @function reciterSuggestionTargetObjectSelector
 * @return {OpenaireSuggestionTarget[]}
 */
export function reciterSuggestionTargetObjectSelector(source: string): MemoizedSelector<OpenaireState, OpenaireSuggestionTarget[]> {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state.targets);
}

/**
 * Returns true if the Reciter Suggestion Targets are loaded.
 * @function isReciterSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetLoadedSelector = (source: string) => {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state?.loaded || false);
};

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isreciterSuggestionTargetProcessingSelector = (source: string) => {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state?.processing || false);
};

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getReciterSuggestionTargetTotalPagesSelector = (source: string) => {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state?.totalPages || 0);
};

/**
 * Returns the current page of Reciter Suggestion Targets.
 * @function getReciterSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getReciterSuggestionTargetCurrentPageSelector = (source: string) => {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state?.currentPage || 0);
};

/**
 * Returns the total number of Reciter Suggestion Targets.
 * @function getReciterSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getReciterSuggestionTargetTotalsSelector = (source: string) => {
  return createSelector(reciterSuggestionSourceSelector(source), (state: SuggestionTargetEntry) => state?.totalElements || 0);
};

/**
 * Returns Suggestion Targets for the current user.
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {OpenaireSuggestionTarget[]}
 */
export const getCurrentUserSuggestionTargetsSelector = () => {
  return createSelector(reciterSuggestionTargetStateSelector(), (state: SuggestionTargetState) => state?.currentUserTargets || []);
};

/**
 * Returns whether the user has consulted their suggestions
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {boolean}
 */
export const getCurrentUserSuggestionTargetsVisitedSelector = () => {
  return createSelector(reciterSuggestionTargetStateSelector(), (state: SuggestionTargetState) => state?.currentUserTargetsVisited || false);
};

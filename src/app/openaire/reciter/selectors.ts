import { createSelector, MemoizedSelector } from '@ngrx/store';
import { subStateSelector } from '../../shared/selector.util';
import { ReciterSuggestionStat,  reciterSuggestionSelector} from './recitersuggestions.reducer';
import { SuggestionTargetObject } from '../../core/openaire/reciter-suggestions/models/suggestion-target.model';
import { SuggestionTargetState } from './suggestion-target/suggestion-target.reducer';

/**
 * Returns the Reciter Suggestion Target state.
 * @function _getReciterSuggestionTargetState
 * @param {AppState} state Top level state.
 * @return {ReciterSuggestionStat}
 */
const _getReciterSuggestionTargetState = (state: any) => state.reciter;

// Reciter Suggestion Targets
// ----------------------------------------------------------------------------

/**
 * Returns the Reciter Suggestion Targets State.
 * @function reciterSuggestionTargetStateSelector
 * @return {ReciterSuggestionStat}
 */
export function reciterSuggestionTargetStateSelector(): MemoizedSelector<ReciterSuggestionStat, SuggestionTargetState> {
  return subStateSelector<ReciterSuggestionStat, SuggestionTargetState>(reciterSuggestionSelector, 'suggestionTarget');
}

/**
 * Returns the Reciter Suggestion Targets list.
 * @function reciterSuggestionTargetObjectSelector
 * @return {SuggestionTargetObject[]}
 */
export function reciterSuggestionTargetObjectSelector(): MemoizedSelector<ReciterSuggestionStat, SuggestionTargetObject[]> {
  return subStateSelector<ReciterSuggestionStat, SuggestionTargetObject[]>(reciterSuggestionTargetStateSelector(), 'targets')
}

/**
 * Returns true if the Reciter Suggestion Targets are loaded.
 * @function isReciterSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetLoadedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: ReciterSuggestionStat) => state.suggestionTarget.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isreciterSuggestionTargetProcessingSelector = createSelector(_getReciterSuggestionTargetState,
  (state: ReciterSuggestionStat) => state.suggestionTarget.processing
);

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalPagesSelector = createSelector(_getReciterSuggestionTargetState,
  (state: ReciterSuggestionStat) => state.suggestionTarget.totalPages
);

/**
 * Returns the current page of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getreciterSuggestionTargetCurrentPageSelector = createSelector(_getReciterSuggestionTargetState,
  (state: ReciterSuggestionStat) => state.suggestionTarget.currentPage
);

/**
 * Returns the total number of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getreciterSuggestionTargetTotalsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: ReciterSuggestionStat) => state.suggestionTarget.totalElements
);

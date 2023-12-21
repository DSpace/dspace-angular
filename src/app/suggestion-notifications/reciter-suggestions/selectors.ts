import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import { suggestionNotificationsSelector, SuggestionNotificationsState } from '../../notifications/notifications.reducer';
import { SuggestionTarget } from '../../core/suggestion-notifications/reciter-suggestions/models/suggestion-target.model';
import { SuggestionTargetState } from './suggestion-targets/suggestion-targets.reducer';
import {subStateSelector} from '../../submission/selectors';

/**
 * Returns the Reciter Suggestion Target state.
 * @function _getReciterSuggestionTargetState
 * @param {AppState} state Top level state.
 * @return {SuggestionNotificationsState}
 */
const _getReciterSuggestionTargetState = createFeatureSelector<SuggestionNotificationsState>('suggestionNotifications');

// Reciter Suggestion Targets
// ----------------------------------------------------------------------------

/**
 * Returns the Reciter Suggestion Targets State.
 * @function reciterSuggestionTargetStateSelector
 * @return {SuggestionNotificationsState}
 */
export function reciterSuggestionTargetStateSelector(): MemoizedSelector<SuggestionNotificationsState, SuggestionTargetState> {
  return subStateSelector<SuggestionNotificationsState, SuggestionTargetState>(suggestionNotificationsSelector, 'suggestionTarget');
}

/**
 * Returns the Reciter Suggestion Targets list.
 * @function reciterSuggestionTargetObjectSelector
 * @return {SuggestionTarget[]}
 */
export function reciterSuggestionTargetObjectSelector(): MemoizedSelector<SuggestionNotificationsState, SuggestionTarget[]> {
  return subStateSelector<SuggestionNotificationsState, SuggestionTarget[]>(reciterSuggestionTargetStateSelector(), 'targets');
}

/**
 * Returns true if the Reciter Suggestion Targets are loaded.
 * @function isReciterSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetLoadedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetProcessingSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.processing
);

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getReciterSuggestionTargetTotalPagesSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.totalPages
);

/**
 * Returns the current page of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getReciterSuggestionTargetCurrentPageSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentPage
);

/**
 * Returns the total number of Reciter Suggestion Targets.
 * @function getreciterSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getReciterSuggestionTargetTotalsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.totalElements
);

/**
 * Returns Suggestion Targets for the current user.
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {SuggestionTarget[]}
 */
export const getCurrentUserSuggestionTargetsSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentUserTargets
);

/**
 * Returns whether or not the user has consulted their suggestions
 * @function getCurrentUserReciterSuggestionTargetSelector
 * @return {boolean}
 */
export const getCurrentUserSuggestionTargetsVisitedSelector = createSelector(_getReciterSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentUserTargetsVisited
);

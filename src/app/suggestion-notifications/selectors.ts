import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { SuggestionTarget } from '../core/notifications/suggestions/models/suggestion-target.model';
import {
  suggestionNotificationsSelector,
  SuggestionNotificationsState,
} from '../notifications/notifications.reducer';
import { SuggestionTargetState } from '../notifications/suggestion-targets/suggestion-targets.reducer';
import { subStateSelector } from '../submission/selectors';

/**
 * Returns the Reciter Suggestion Target state.
 * @function _getSuggestionTargetState
 * @param {AppState} state Top level state.
 * @return {SuggestionNotificationsState}
 */
const _getSuggestionTargetState = createFeatureSelector<SuggestionNotificationsState>('suggestionNotifications');

// Reciter Suggestion Targets
// ----------------------------------------------------------------------------

/**
 * Returns the Suggestion Targets State.
 * @function suggestionTargetStateSelector
 * @return {SuggestionNotificationsState}
 */
export function suggestionTargetStateSelector(): MemoizedSelector<SuggestionNotificationsState, SuggestionTargetState> {
  return subStateSelector<SuggestionNotificationsState, SuggestionTargetState>(suggestionNotificationsSelector, 'suggestionTarget');
}

/**
 * Returns the Suggestion Targets list.
 * @function suggestionTargetObjectSelector
 * @return {SuggestionTarget[]}
 */
export function suggestionTargetObjectSelector(): MemoizedSelector<SuggestionNotificationsState, SuggestionTarget[]> {
  return subStateSelector<SuggestionNotificationsState, SuggestionTarget[]>(suggestionTargetStateSelector(), 'targets');
}

/**
 * Returns true if the Suggestion Targets are loaded.
 * @function isSuggestionTargetLoadedSelector
 * @return {boolean}
 */
export const isSuggestionTargetLoadedSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.loaded,
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isReciterSuggestionTargetProcessingSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.processing,
);

/**
 * Returns the total available pages of Reciter Suggestion Targets.
 * @function getSuggestionTargetTotalPagesSelector
 * @return {number}
 */
export const getSuggestionTargetTotalPagesSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.totalPages,
);

/**
 * Returns the current page of Suggestion Targets.
 * @function getSuggestionTargetCurrentPageSelector
 * @return {number}
 */
export const getSuggestionTargetCurrentPageSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentPage,
);

/**
 * Returns the total number of Suggestion Targets.
 * @function getSuggestionTargetTotalsSelector
 * @return {number}
 */
export const getSuggestionTargetTotalsSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.totalElements,
);

/**
 * Returns Suggestion Targets for the current user.
 * @function getCurrentUserSuggestionTargetSelector
 * @return {SuggestionTarget[]}
 */
export const getCurrentUserSuggestionTargetsSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentUserTargets,
);

/**
 * Returns whether or not the user has consulted their suggestions
 * @function getCurrentUserSuggestionTargetSelector
 * @return {boolean}
 */
export const getCurrentUserSuggestionTargetsVisitedSelector = createSelector(_getSuggestionTargetState,
  (state: SuggestionNotificationsState) => state.suggestionTarget.currentUserTargetsVisited,
);

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { QualityAssuranceSourceObject } from '../core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceTopicObject } from '../core/notifications/qa/models/quality-assurance-topic.model';
import { subStateSelector } from '../shared/selector.util';
import {
  suggestionNotificationsSelector,
  SuggestionNotificationsState,
} from './notifications.reducer';
import { QualityAssuranceSourceState } from './qa/source/quality-assurance-source.reducer';
import { QualityAssuranceTopicState } from './qa/topics/quality-assurance-topics.reducer';

/**
 * Returns the Notifications state.
 * @function _getNotificationsState
 * @param {AppState} state Top level state.
 * @return {SuggestionNotificationsState}
 */
const _getNotificationsState = createFeatureSelector<SuggestionNotificationsState>('suggestionNotifications');

// Quality Assurance topics
// ----------------------------------------------------------------------------

/**
 * Returns the Quality Assurance topics State.
 * @function qualityAssuranceTopicsStateSelector
 * @return {QualityAssuranceTopicState}
 */
export function qualityAssuranceTopicsStateSelector(): MemoizedSelector<SuggestionNotificationsState, QualityAssuranceTopicState> {
  return subStateSelector<SuggestionNotificationsState,QualityAssuranceTopicState>(suggestionNotificationsSelector, 'qaTopic');
}

/**
 * Returns the Quality Assurance topics list.
 * @function qualityAssuranceTopicsObjectSelector
 * @return {QualityAssuranceTopicObject[]}
 */
export function qualityAssuranceTopicsObjectSelector(): MemoizedSelector<SuggestionNotificationsState, QualityAssuranceTopicObject[]> {
  return subStateSelector<SuggestionNotificationsState, QualityAssuranceTopicObject[]>(qualityAssuranceTopicsStateSelector(), 'topics');
}

/**
 * Returns true if the Quality Assurance topics are loaded.
 * @function isQualityAssuranceTopicsLoadedSelector
 * @return {boolean}
 */
export const isQualityAssuranceTopicsLoadedSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaTopic.loaded,
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isQualityAssuranceTopicsProcessingSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaTopic.processing,
);

/**
 * Returns the total available pages of Quality Assurance topics.
 * @function getQualityAssuranceTopicsTotalPagesSelector
 * @return {number}
 */
export const getQualityAssuranceTopicsTotalPagesSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaTopic.totalPages,
);

/**
 * Returns the current page of Quality Assurance topics.
 * @function getQualityAssuranceTopicsCurrentPageSelector
 * @return {number}
 */
export const getQualityAssuranceTopicsCurrentPageSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaTopic.currentPage,
);

/**
 * Returns the total number of Quality Assurance topics.
 * @function getQualityAssuranceTopicsTotalsSelector
 * @return {number}
 */
export const getQualityAssuranceTopicsTotalsSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaTopic.totalElements,
);

// Quality Assurance source
// ----------------------------------------------------------------------------

/**
 * Returns the Quality Assurance source State.
 * @function qualityAssuranceSourceStateSelector
 * @return {QualityAssuranceSourceState}
 */
export function qualityAssuranceSourceStateSelector(): MemoizedSelector<SuggestionNotificationsState, QualityAssuranceSourceState> {
  return subStateSelector<SuggestionNotificationsState,QualityAssuranceSourceState>(suggestionNotificationsSelector, 'qaSource');
}

/**
 * Returns the Quality Assurance source list.
 * @function qualityAssuranceSourceObjectSelector
 * @return {QualityAssuranceSourceObject[]}
 */
export function qualityAssuranceSourceObjectSelector(): MemoizedSelector<SuggestionNotificationsState, QualityAssuranceSourceObject[]> {
  return subStateSelector<SuggestionNotificationsState, QualityAssuranceSourceObject[]>(qualityAssuranceSourceStateSelector(), 'source');
}

/**
 * Returns true if the Quality Assurance source are loaded.
 * @function isQualityAssuranceSourceLoadedSelector
 * @return {boolean}
 */
export const isQualityAssuranceSourceLoadedSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaSource.loaded,
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isQualityAssuranceSourceProcessingSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaSource.processing,
);

/**
 * Returns the total available pages of Quality Assurance source.
 * @function getQualityAssuranceSourceTotalPagesSelector
 * @return {number}
 */
export const getQualityAssuranceSourceTotalPagesSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaSource.totalPages,
);

/**
 * Returns the current page of Quality Assurance source.
 * @function getQualityAssuranceSourceCurrentPageSelector
 * @return {number}
 */
export const getQualityAssuranceSourceCurrentPageSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaSource.currentPage,
);

/**
 * Returns the total number of Quality Assurance source.
 * @function getQualityAssuranceSourceTotalsSelector
 * @return {number}
 */
export const getQualityAssuranceSourceTotalsSelector = createSelector(_getNotificationsState,
  (state: SuggestionNotificationsState) => state.qaSource.totalElements,
);

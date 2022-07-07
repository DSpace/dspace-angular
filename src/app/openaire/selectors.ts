import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { subStateSelector } from '../shared/selector.util';
import { openaireSelector, OpenaireState } from './openaire.reducer';
import { OpenaireBrokerTopicObject } from '../core/openaire/broker/models/openaire-broker-topic.model';
import { OpenaireBrokerTopicState } from './broker/topics/openaire-broker-topics.reducer';

/**
 * Returns the OpenAIRE state.
 * @function _getOpenaireState
 * @param {AppState} state Top level state.
 * @return {OpenaireState}
 */
const _getOpenaireState = createFeatureSelector<OpenaireState>('openaire');

// OpenAIRE Broker topics
// ----------------------------------------------------------------------------

/**
 * Returns the OpenAIRE Broker topics State.
 * @function openaireBrokerTopicsStateSelector
 * @return {OpenaireBrokerTopicState}
 */
export function openaireBrokerTopicsStateSelector(): MemoizedSelector<OpenaireState, OpenaireBrokerTopicState> {
  return subStateSelector<OpenaireState,OpenaireBrokerTopicState>(openaireSelector, 'brokerTopic');
}

/**
 * Returns the OpenAIRE Broker topics list.
 * @function openaireBrokerTopicsObjectSelector
 * @return {OpenaireBrokerTopicObject[]}
 */
export function openaireBrokerTopicsObjectSelector(): MemoizedSelector<OpenaireState, OpenaireBrokerTopicObject[]> {
  return subStateSelector<OpenaireState, OpenaireBrokerTopicObject[]>(openaireBrokerTopicsStateSelector(), 'topics');
}

/**
 * Returns true if the OpenAIRE Broker topics are loaded.
 * @function isOpenaireBrokerTopicsLoadedSelector
 * @return {boolean}
 */
export const isOpenaireBrokerTopicsLoadedSelector = createSelector(_getOpenaireState,
  (state: OpenaireState) => state.brokerTopic.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const sOpenaireBrokerTopicsProcessingSelector = createSelector(_getOpenaireState,
  (state: OpenaireState) => state.brokerTopic.processing
);

/**
 * Returns the total available pages of OpenAIRE Broker topics.
 * @function getOpenaireBrokerTopicsTotalPagesSelector
 * @return {number}
 */
export const getOpenaireBrokerTopicsTotalPagesSelector = createSelector(_getOpenaireState,
  (state: OpenaireState) => state.brokerTopic.totalPages
);

/**
 * Returns the current page of OpenAIRE Broker topics.
 * @function getOpenaireBrokerTopicsCurrentPageSelector
 * @return {number}
 */
export const getOpenaireBrokerTopicsCurrentPageSelector = createSelector(_getOpenaireState,
  (state: OpenaireState) => state.brokerTopic.currentPage
);

/**
 * Returns the total number of OpenAIRE Broker topics.
 * @function getOpenaireBrokerTopicsTotalsSelector
 * @return {number}
 */
export const getOpenaireBrokerTopicsTotalsSelector = createSelector(_getOpenaireState,
  (state: OpenaireState) => state.brokerTopic.totalElements
);

import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { openaireBrokerTopicsReducer, OpenaireBrokerTopicState, } from './broker/topics/openaire-broker-topics.reducer';
import { SuggestionTargetReducer, SuggestionTargetState } from './reciter/suggestion-target/suggestion-target.reducer';

/**
 * The OpenAIRE State
 */
export interface OpenaireState {
  'brokerTopic': OpenaireBrokerTopicState,
  'suggestionTarget': SuggestionTargetState,
}

export const openaireReducers: ActionReducerMap<OpenaireState> = {
  brokerTopic: openaireBrokerTopicsReducer,
  suggestionTarget: SuggestionTargetReducer,
};

export const openaireSelector = createFeatureSelector<OpenaireState>('openaire');

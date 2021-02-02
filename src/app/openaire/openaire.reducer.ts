import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { openaireBrokerTopicsReducer, OpenaireBrokerTopicState, } from './broker/topics/openaire-broker-topics.reducer';
import {
  SuggestionTargetsReducer,
  SuggestionTargetState
} from './reciter-suggestions/suggestion-targets/suggestion-targets.reducer';

/**
 * The OpenAIRE State
 */
export interface OpenaireState {
  'brokerTopic': OpenaireBrokerTopicState;
  'suggestionTarget': SuggestionTargetState;
}

export const openaireReducers: ActionReducerMap<OpenaireState> = {
  brokerTopic: openaireBrokerTopicsReducer,
  suggestionTarget: SuggestionTargetsReducer,
};

export const openaireSelector = createFeatureSelector<OpenaireState>('openaire');

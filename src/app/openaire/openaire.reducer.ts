import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import {
  OpenaireBrokerTopicState,
  openaireBrokerTopicsReducer,
} from './broker/topics/openaire-broker-topics.reducer';

/**
 * The OpenAIRE State
 */
export interface OpenaireState {
  'brokerTopic': OpenaireBrokerTopicState,
}

export const openaireReducers: ActionReducerMap<OpenaireState> = {
  brokerTopic: openaireBrokerTopicsReducer,
};

export const openaireSelector = createFeatureSelector<OpenaireState>('openaire');

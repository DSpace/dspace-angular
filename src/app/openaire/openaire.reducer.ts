import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import {
  OpenaireBrokerTopicState,
  openaireBrokerTopicReducer,
} from './broker/openaire-broker-topic.reducer';

/**
 * The OpenAIRE State
 */
export interface OpenaireState {
  'brokerTopic': OpenaireBrokerTopicState,
}

export const openaireReducers: ActionReducerMap<OpenaireState> = {
  brokerTopic: openaireBrokerTopicReducer,
};

export const openaireSelector = createFeatureSelector<OpenaireState>('openaire');

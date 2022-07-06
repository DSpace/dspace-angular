import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { qualityAssuranceSourceReducer, QualityAssuranceSourceState } from './qa/source/quality-assurance-source.reducer';
import { qualityAssuranceTopicsReducer, QualityAssuranceTopicState, } from './qa/topics/quality-assurance-topics.reducer';

/**
 * The OpenAIRE State
 */
export interface NotificationsState {
  'brokerTopic': QualityAssuranceTopicState;
  'brokerSource': QualityAssuranceSourceState;
}

export const notificationsReducers: ActionReducerMap<NotificationsState> = {
  brokerTopic: qualityAssuranceTopicsReducer,
  brokerSource: qualityAssuranceSourceReducer
};

export const notificationsSelector = createFeatureSelector<NotificationsState>('notifications');

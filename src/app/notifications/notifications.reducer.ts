import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
  qualityAssuranceSourceReducer,
  QualityAssuranceSourceState
} from './qa/source/quality-assurance-source.reducer';
import {
  qualityAssuranceTopicsReducer,
  QualityAssuranceTopicState,
} from './qa/topics/quality-assurance-topics.reducer';

/**
 * The OpenAIRE State
 */
export interface SuggestionNotificationsState {
  'qaTopic': QualityAssuranceTopicState;
  'qaSource': QualityAssuranceSourceState;
}

export const suggestionNotificationsReducers: ActionReducerMap<SuggestionNotificationsState> = {
  qaTopic: qualityAssuranceTopicsReducer,
  qaSource: qualityAssuranceSourceReducer
};

export const suggestionNotificationsSelector = createFeatureSelector<SuggestionNotificationsState>('suggestionNotifications');

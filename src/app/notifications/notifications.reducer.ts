import {
  ActionReducerMap,
  createFeatureSelector,
} from '@ngrx/store';

import {
  qualityAssuranceSourceReducer,
  QualityAssuranceSourceState,
} from './qa/source/quality-assurance-source.reducer';
import {
  qualityAssuranceTopicsReducer,
  QualityAssuranceTopicState,
} from './qa/topics/quality-assurance-topics.reducer';
import {
  SuggestionTargetsReducer,
  SuggestionTargetState,
} from './suggestion-targets/suggestion-targets.reducer';

/**
 * The OpenAIRE State
 */
export interface SuggestionNotificationsState {
  'qaTopic': QualityAssuranceTopicState;
  'qaSource': QualityAssuranceSourceState;
  'suggestionTarget': SuggestionTargetState;
}

export const suggestionNotificationsReducers: ActionReducerMap<SuggestionNotificationsState> = {
  qaTopic: qualityAssuranceTopicsReducer,
  qaSource: qualityAssuranceSourceReducer,
  suggestionTarget: SuggestionTargetsReducer,
};

export const suggestionNotificationsSelector = createFeatureSelector<SuggestionNotificationsState>('suggestionNotifications');

import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import {
  SuggestionTargetsReducer,
  SuggestionTargetState
} from './reciter-suggestions/suggestion-targets/suggestion-targets.reducer';

/**
 * The OpenAIRE State
 */
export interface OpenaireState {
  'suggestionTarget': SuggestionTargetState;
}

export const openaireReducers: ActionReducerMap<OpenaireState> = {
  suggestionTarget: SuggestionTargetsReducer,
};

export const openaireSelector = createFeatureSelector<OpenaireState>('openaire');

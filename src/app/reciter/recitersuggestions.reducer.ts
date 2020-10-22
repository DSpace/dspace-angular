import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import {
  SuggestionTargetReducer,
  SuggestionTargetState,
} from './suggestion-target/suggestion-target.reducer';

/**
 * The ReciterSuggestion State
 */
export interface ReciterSuggestionStat {
  'suggestionTarget': SuggestionTargetState,
}

export const reciterSuggestionReducers: ActionReducerMap<ReciterSuggestionStat> = {
  suggestionTarget: SuggestionTargetReducer,
};

export const reciterSuggestionSelector = createFeatureSelector<ReciterSuggestionStat>('reciter');


import { SuggestionTargetObject } from '../../../core/openaire/reciter-suggestions/models/suggestion-target.model';
import {
  SuggestionTargetActions,
  SuggestionTargetActionTypes
} from './suggestion-target.actions';

/**
 * The interface representing the OpenAIRE Broker topic state.
 */
export interface SuggestionTargetState {
  targets: SuggestionTargetObject[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

/**
 * Used for the OpenAIRE Suggestion Target state initialization.
 */
const SuggestionTargetInitialState: SuggestionTargetState = {
  targets: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0
};

/**
 * The OpenAIRE Broker Topic Reducer
 *
 * @param state
 *    the current state initialized with SuggestionTargetInitialState
 * @param action
 *    the action to perform on the state
 * @return SuggestionTargetState
 *    the new state
 */
export function SuggestionTargetReducer(state = SuggestionTargetInitialState, action: SuggestionTargetActions): SuggestionTargetState {
  switch (action.type) {
    case SuggestionTargetActionTypes.RETRIEVE_ALL_TARGETS: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case SuggestionTargetActionTypes.ADD_TARGETS: {
      return Object.assign({}, state, {
        targets: state.targets.concat(action.payload.targets),
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: state.currentPage,
        totalElements: action.payload.totalElements
      });
    }

    case SuggestionTargetActionTypes.RETRIEVE_ALL_TARGETS_ERROR: {
      return Object.assign({}, state, {
        processing: false,
        loaded: true,
        currentPage: 0
      });
    }

    default: {
      return state;
    }
  }
}

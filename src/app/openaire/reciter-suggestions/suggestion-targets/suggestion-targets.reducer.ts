import { SuggestionTargetActionTypes, SuggestionTargetsActions } from './suggestion-targets.actions';
import { OpenaireSuggestionTarget } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';

/**
 * The interface representing the OpenAIRE suggestion targets state.
 */
export interface SuggestionTargetState {
  targets: OpenaireSuggestionTarget[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  currentUserTargets: OpenaireSuggestionTarget[];
  currentUserTargetsVisited: boolean;
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
  totalElements: 0,
  currentUserTargets: null,
  currentUserTargetsVisited: false
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
export function SuggestionTargetsReducer(state = SuggestionTargetInitialState, action: SuggestionTargetsActions): SuggestionTargetState {
  switch (action.type) {
    case SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE: {
      return Object.assign({}, state, {
        targets: [],
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

    case SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR: {
      return Object.assign({}, state, {
        targets: [],
        processing: false,
        loaded: true,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      });
    }

    case SuggestionTargetActionTypes.ADD_USER_SUGGESTIONS: {
      return Object.assign({}, state, {
        currentUserTargets: action.payload.suggestionTargets
      });
    }

    case SuggestionTargetActionTypes.MARK_USER_SUGGESTIONS_AS_VISITED: {
      return Object.assign({}, state, {
        currentUserTargetsVisited: true
      });
    }

    case SuggestionTargetActionTypes.CLEAR_TARGETS: {
      return Object.assign({}, state, {
        targets: [],
        processing: false,
        loaded: false,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      });
    }

    default: {
      return state;
    }
  }
}

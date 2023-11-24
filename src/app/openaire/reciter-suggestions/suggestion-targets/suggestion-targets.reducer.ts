import { SuggestionTargetActionTypes, SuggestionTargetsActions } from './suggestion-targets.actions';
import { OpenaireSuggestionTarget } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';

/**
 * The interface representing the OpenAIRE suggestion targets state.
 */
export interface SuggestionTargetEntry {
  targets: OpenaireSuggestionTarget[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  currentUserTargets: OpenaireSuggestionTarget[];
  currentUserTargetsVisited: boolean;
}

export interface SuggestionTargetState {
  [source: string]: SuggestionTargetEntry;
}

/**
 * Used for the OpenAIRE Suggestion Target state initialization.
 */
const SuggestionTargetInitialEntity: SuggestionTargetEntry = {
  targets: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
  currentUserTargets: null,
  currentUserTargetsVisited: false
};

const SuggestionTargetInitialState: SuggestionTargetState = {
  'oaire' : SuggestionTargetInitialEntity
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
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          if (key === action.payload.source) {
            updatedSuggestion[key] = {
              targets: [],
              processing: true
            };
          } else {
            updatedSuggestion[key] = state[key];
          }
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    case SuggestionTargetActionTypes.ADD_TARGETS: {
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          updatedSuggestion[key] = {
            targets: state[key].targets.concat(action.payload.targets
                                  .filter(target => target.source === key)),
            processing: false,
            loaded: true,
            totalPages: action.payload.totalPages,
            currentPage: state[key].currentPage,
            totalElements: action.payload.totalElements,
          };
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    case SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR: {
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          updatedSuggestion[key] = {
            targets: [],
            processing: false,
            loaded: true,
            totalPages: 0,
            currentPage: 0,
            totalElements: 0,
          };
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    case SuggestionTargetActionTypes.ADD_USER_SUGGESTIONS: {
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          updatedSuggestion[key] = {
            targets: state[key].targets.concat(action.payload.suggestionTargets
              .filter(target => target.source === key)),
          };
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    case SuggestionTargetActionTypes.MARK_USER_SUGGESTIONS_AS_VISITED: {
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          updatedSuggestion[key] = {
            currentUserTargetsVisited: true
          };
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    case SuggestionTargetActionTypes.CLEAR_TARGETS: {
      const updatedSuggestion = {};

      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          updatedSuggestion[key] = {
            targets: [],
            processing: false,
            loaded: false,
            totalPages: 0,
            currentPage: 0,
            totalElements: 0,
          };
        }
      }
      return Object.assign({}, state, updatedSuggestion);
    }

    default: {
      return state;
    }
  }
}

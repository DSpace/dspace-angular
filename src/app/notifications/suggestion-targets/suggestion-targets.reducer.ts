import { SuggestionTarget } from '../../core/notifications/suggestions/models/suggestion-target.model';
import {
  SuggestionTargetActionTypes,
  SuggestionTargetsActions,
} from './suggestion-targets.actions';

/**
 * The interface representing the OpenAIRE suggestion targets state.
 */
export interface SuggestionTargetEntry {
  targets: SuggestionTarget[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export interface SuggestionSourcesState {
  [source: string]: SuggestionTargetEntry;
}

export interface SuggestionTargetState {
  sources: SuggestionSourcesState;
  currentUserTargets: SuggestionTarget[];
  currentUserTargetsVisited: boolean;
}

/**
 * Used for the OpenAIRE Suggestion Target state initialization.
 */
const suggestionSourceTargetsInitialState: SuggestionTargetEntry = {
  targets: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
};

const SuggestionTargetInitialState: SuggestionTargetState = {
  sources: {},
  currentUserTargets: null,
  currentUserTargetsVisited: false,
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
      const sourceState = state.sources[action.payload.source] || Object.assign({}, suggestionSourceTargetsInitialState);
      const newSourceState = Object.assign({}, sourceState, {
        targets: [],
        processing: true,
      });

      return Object.assign({}, state, {
        sources:
          Object.assign({}, state.sources, {
            [action.payload.source]: newSourceState,
          }),
      });
    }

    case SuggestionTargetActionTypes.ADD_TARGETS: {
      const sourceState = state.sources[action.payload.source] || Object.assign({}, suggestionSourceTargetsInitialState);
      const newSourceState = Object.assign({}, sourceState, {
        targets: sourceState.targets.concat(action.payload.targets),
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalElements: action.payload.totalElements,
      });

      return Object.assign({}, state, {
        sources:
          Object.assign({}, state.sources, {
            [action.payload.source]: newSourceState,
          }),
      });
    }

    case SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR: {
      const sourceState = state.sources[action.payload.source] || Object.assign({}, suggestionSourceTargetsInitialState);
      const newSourceState = Object.assign({}, sourceState, {
        targets: [],
        processing: false,
        loaded: true,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      });

      return Object.assign({}, state, {
        sources:
          Object.assign({}, state.sources, {
            [action.payload.source]: newSourceState,
          }),
      });
    }

    case SuggestionTargetActionTypes.ADD_USER_SUGGESTIONS: {
      return Object.assign({}, state, {
        currentUserTargets: action.payload.suggestionTargets,
      });
    }

    case SuggestionTargetActionTypes.MARK_USER_SUGGESTIONS_AS_VISITED: {
      return Object.assign({}, state, {
        currentUserTargetsVisited: true,
      });
    }

    case SuggestionTargetActionTypes.CLEAR_TARGETS: {
      const sourceState = state.sources[action.payload.source] || Object.assign({}, suggestionSourceTargetsInitialState);
      const newSourceState = Object.assign({}, sourceState, {
        targets: [],
        processing: false,
        loaded: false,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      });

      return Object.assign({}, state, {
        sources:
          Object.assign({}, state.sources, {
            [action.payload.source]: newSourceState,
          }),
      });
    }

    default: {
      return state;
    }
  }
}

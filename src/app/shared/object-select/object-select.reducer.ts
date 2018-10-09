import { isEmpty } from '../empty.util';
import { ObjectSelectionAction, ObjectSelectionActionTypes } from './object-select.actions';

/**
 * Interface that represents the state for a single filters
 */
export interface ObjectSelectionState {
  checked: boolean;
}

/**
 * Interface that represents the state for all available filters
 */
export interface ObjectSelectionsState {
  [id: string]: ObjectSelectionState
}

const initialState: ObjectSelectionsState = Object.create(null);

/**
 * Performs a search filter action on the current state
 * @param {SearchFiltersState} state The state before the action is performed
 * @param {SearchFilterAction} action The action that should be performed
 * @returns {SearchFiltersState} The state after the action is performed
 */
export function objectSelectionReducer(state = initialState, action: ObjectSelectionAction): ObjectSelectionsState {

  switch (action.type) {

    case ObjectSelectionActionTypes.INITIAL_SELECT: {
      if (isEmpty(state) || isEmpty(state[action.id])) {
        return Object.assign({}, state, {
          [action.id]: {
            checked: true
          }
        });
      }
      return state;
    }

    case ObjectSelectionActionTypes.INITIAL_DESELECT: {
      if (isEmpty(state) || isEmpty(state[action.id])) {
        return Object.assign({}, state, {
          [action.id]: {
            checked: false
          }
        });
      }
      return state;
    }

    case ObjectSelectionActionTypes.SELECT: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: true
        }
      });
    }

    case ObjectSelectionActionTypes.DESELECT: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: false
        }
      });
    }

    case ObjectSelectionActionTypes.SWITCH: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: (isEmpty(state) || isEmpty(state[action.id])) ? true : !state[action.id].checked
        }
      });
    }

    case ObjectSelectionActionTypes.RESET: {
      return {};
    }

    default: {
      return state;
    }
  }
}

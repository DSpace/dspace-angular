import { isEmpty } from '../empty.util';
import { ItemSelectionAction, ItemSelectionActionTypes } from './item-select.actions';

/**
 * Interface that represents the state for a single filters
 */
export interface ItemSelectionState {
  checked: boolean;
}

/**
 * Interface that represents the state for all available filters
 */
export interface ItemSelectionsState {
  [id: string]: ItemSelectionState
}

const initialState: ItemSelectionsState = Object.create(null);

/**
 * Performs a search filter action on the current state
 * @param {SearchFiltersState} state The state before the action is performed
 * @param {SearchFilterAction} action The action that should be performed
 * @returns {SearchFiltersState} The state after the action is performed
 */
export function itemSelectionReducer(state = initialState, action: ItemSelectionAction): ItemSelectionsState {

  switch (action.type) {

    case ItemSelectionActionTypes.INITIAL_SELECT: {
      if (isEmpty(state) || isEmpty(state[action.id])) {
        return Object.assign({}, state, {
          [action.id]: {
            checked: true
          }
        });
      }
      return state;
    }

    case ItemSelectionActionTypes.INITIAL_DESELECT: {
      if (isEmpty(state) || isEmpty(state[action.id])) {
        return Object.assign({}, state, {
          [action.id]: {
            checked: false
          }
        });
      }
      return state;
    }

    case ItemSelectionActionTypes.SELECT: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: true
        }
      });
    }

    case ItemSelectionActionTypes.DESELECT: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: false
        }
      });
    }

    case ItemSelectionActionTypes.SWITCH: {
      return Object.assign({}, state, {
        [action.id]: {
          checked: (isEmpty(state) || isEmpty(state[action.id])) ? true : !state[action.id].checked
        }
      });
    }

    case ItemSelectionActionTypes.RESET: {
      return {};
    }

    default: {
      return state;
    }
  }
}

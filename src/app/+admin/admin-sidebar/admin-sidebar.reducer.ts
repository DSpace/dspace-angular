import { AdminSidebarSectionAction, AdminSidebarSectionActionTypes } from './admin-sidebar.actions';
import { hasValue } from '../../shared/empty.util';

/**
 * Interface that represents the state for a single section
 */
export interface AdminSidebarSectionState {
  sectionCollapsed: boolean,
}

/**
 * Interface that represents the state for all available sections
 */
export interface AdminSidebarSectionsState {
  [name: string]: AdminSidebarSectionState
}

const initialState: AdminSidebarSectionsState = Object.create(null);
const initiallyCollapsed = true;
/**
 * Performs a search section action on the current state
 * @param {AdminSidebarSectionsState} state The state before the action is performed
 * @param {AdminSidebarSectionAction} action The action that should be performed
 * @returns {AdminSidebarSectionsState} The state after the action is performed
 */
export function sidebarSectionReducer(state = initialState, action: AdminSidebarSectionAction): AdminSidebarSectionsState {

  switch (action.type) {
    case AdminSidebarSectionActionTypes.COLLAPSE: {
      return Object.assign({}, state, {
        [action.sectionName]: {
          sectionCollapsed: true,
        }
      });
    }

    case AdminSidebarSectionActionTypes.EXPAND: {
      return Object.assign({}, state, {
        [action.sectionName]: {
          sectionCollapsed: false,
        }
      });

    }
    case AdminSidebarSectionActionTypes.TOGGLE: {
      const currentState = state[action.sectionName];
      const collapsed = hasValue(currentState) ? currentState.sectionCollapsed : initiallyCollapsed;
      return Object.assign({}, state, {
        [action.sectionName]: {
          sectionCollapsed: !collapsed,
        }
      });

    }

    default: {
      return state;
    }
  }
}

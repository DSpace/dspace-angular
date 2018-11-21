import {
  AdminSidebarAction,
  AdminSidebarSectionAction,
  AdminSidebarActionTypes
} from './admin-sidebar.actions';
import { hasValue } from '../../shared/empty.util';

/**
 * Interface that represents the state for a single sidebar section
 */
export interface AdminSidebarSectionState {
  sectionCollapsed: boolean;
}

export interface AdminSidebarSectionsState {
  [name: string]: AdminSidebarSectionState;
}

/**
 * Interface that represents the state of the admin sidebar and its sections
 */
export interface AdminSidebarState {
  sections: AdminSidebarSectionsState,
  collapsed: boolean;
}

const initialState: AdminSidebarState = Object.create(null);
const initiallySectionCollapsed = true;
const initiallyCollapsed = false;

/**
 * Performs a sidebar action on the current state
 * @param {AdminSidebarState} state The state before the action is performed
 * @param {AdminSidebarAction} action The action that should be performed
 * @returns {AdminSidebarState} The state after the action is performed
 */
export function adminSidebarReducer(state = initialState, action: AdminSidebarAction): AdminSidebarState {

  if (action instanceof AdminSidebarSectionAction) {
    return reduceSectionAction(state, action);
  } else {
    switch (action.type) {
      case AdminSidebarActionTypes.COLLAPSE: {
        return Object.assign({}, state, {
          collapsed: true
        });
      }

      case AdminSidebarActionTypes.EXPAND: {
        return Object.assign({}, state, {
          collapsed: false
        });

      }
      case AdminSidebarActionTypes.TOGGLE: {
        const currentState = state.collapsed;
        const collapsed = hasValue(currentState) ? currentState : initiallyCollapsed;
        return Object.assign({}, state, {
          collapsed: !collapsed
        });
      }
      case AdminSidebarActionTypes.SECTION_COLLAPSE_ALL: {
        const newSectionState: AdminSidebarSectionState = Object.create(null);
        if (hasValue(state.sections)) {
          Object.keys(state.sections).forEach((section) =>
            newSectionState[section] = {
              sectionCollapsed: true
            });
        }
        return Object.assign({}, state, { sections: newSectionState });
      }
      default: {
        return state;
      }
    }
  }
}

function reduceSectionAction(state: AdminSidebarState, action: AdminSidebarSectionAction): AdminSidebarState {
  switch (action.type) {
    case AdminSidebarActionTypes.SECTION_COLLAPSE: {
      const sections = Object.assign({}, state.sections, {
        [action.sectionName]: {
          sectionCollapsed: true,
        }
      });
      return Object.assign({}, state, { sections });
    }

    case AdminSidebarActionTypes.SECTION_EXPAND: {
      const sections = Object.assign({}, state.sections, {
        [action.sectionName]: {
          sectionCollapsed: false,
        }
      });
      return Object.assign({}, state, { sections });

    }
    case AdminSidebarActionTypes.SECTION_TOGGLE: {
      const currentState = state.sections;
      const collapsed = (hasValue(currentState) && currentState[action.sectionName]) ? currentState[action.sectionName].sectionCollapsed : initiallySectionCollapsed;
      const sections = Object.assign({}, state.sections, {
        [action.sectionName]: {
          sectionCollapsed: !collapsed,
        }
      });
      return Object.assign({}, state, { sections });
    }

    default: {
      return state;
    }
  }
}

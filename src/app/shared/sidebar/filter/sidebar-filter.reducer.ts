import {
  FilterInitializeAction,
  SidebarFilterAction,
  SidebarFilterActionTypes
} from './sidebar-filter.actions';

/**
 * Interface that represents the state for a single filters
 */
export interface SidebarFilterState {
  filterCollapsed: boolean;
}

/**
 * Interface that represents the state for all available filters
 */
export interface SidebarFiltersState {
  [name: string]: SidebarFilterState;
}

const initialState: SidebarFiltersState = Object.create(null);

/**
 * Performs a  filter action on the current state
 * @param {SidebarFiltersState} state The state before the action is performed
 * @param {SidebarFilterAction} action The action that should be performed
 * @returns {SidebarFiltersState} The state after the action is performed
 */
export function sidebarFilterReducer(state = initialState, action: SidebarFilterAction): SidebarFiltersState {

  switch (action.type) {

    case SidebarFilterActionTypes.INITIALIZE: {
      const initAction = (action as FilterInitializeAction);
      return Object.assign({}, state, {
        [action.filterName]: {
          filterCollapsed: !initAction.initiallyExpanded,
        }
      });
    }

    case SidebarFilterActionTypes.COLLAPSE: {
      return Object.assign({}, state, {
        [action.filterName]: {
          filterCollapsed: true,
        }
      });
    }

    case SidebarFilterActionTypes.EXPAND: {
      return Object.assign({}, state, {
        [action.filterName]: {
          filterCollapsed: false,
        }
      });
    }

    case SidebarFilterActionTypes.TOGGLE: {
      return Object.assign({}, state, {
        [action.filterName]: {
          filterCollapsed: !state[action.filterName].filterCollapsed,
        }
      });
    }

    default: {
      return state;
    }
  }
}

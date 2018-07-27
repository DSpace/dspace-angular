import { SearchSidebarAction, SearchSidebarActionTypes } from './search-sidebar.actions';

/**
 * Interface that represents the state of the sidebar
 */
export interface SearchSidebarState {
  sidebarCollapsed: boolean;
}

const initialState: SearchSidebarState = {
  sidebarCollapsed: true
};

/**
 * Performs a search sidebar action on the current state
 * @param {SearchSidebarState} state The state before the action is performed
 * @param {SearchSidebarAction} action The action that should be performed
 * @returns {SearchSidebarState} The state after the action is performed
 */
export function sidebarReducer(state = initialState, action: SearchSidebarAction): SearchSidebarState {
  switch (action.type) {

    case SearchSidebarActionTypes.COLLAPSE: {
      return Object.assign({}, state, {
        sidebarCollapsed: true
      });
    }

    case SearchSidebarActionTypes.EXPAND: {
      return Object.assign({}, state, {
        sidebarCollapsed: false
      });

    }

    case SearchSidebarActionTypes.TOGGLE: {
      return Object.assign({}, state, {
        sidebarCollapsed: !state.sidebarCollapsed
      });

    }

    default: {
      return state;
    }
  }
}

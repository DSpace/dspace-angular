import { SearchSidebarAction, SearchSidebarActionTypes } from './search-sidebar.actions';

export interface SearchSidebarState {
  sidebarCollapsed: boolean;
}

const initialState: SearchSidebarState = {
  sidebarCollapsed: true
};

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

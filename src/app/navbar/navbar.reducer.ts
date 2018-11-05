import { NavbarAction, NavbarActionTypes } from './navbar.actions';

export interface NavbarState {
  navCollapsed: boolean;
}

const initialState: NavbarState = {
  navCollapsed: true
};

export function navbarReducer(state = initialState, action: NavbarAction): NavbarState {
  switch (action.type) {

    case NavbarActionTypes.COLLAPSE: {
      return Object.assign({}, state, {
        navCollapsed: true
      });
    }

    case NavbarActionTypes.EXPAND: {
      return Object.assign({}, state, {
        navCollapsed: false
      });

    }

    case NavbarActionTypes.TOGGLE: {
      return Object.assign({}, state, {
        navCollapsed: !state.navCollapsed
      });

    }

    default: {
      return state;
    }
  }
}

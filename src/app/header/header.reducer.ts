import { HeaderAction, HeaderActionTypes } from './header.actions';

export interface HeaderState {
  navCollapsed: boolean;
}

const initialState: HeaderState = {
  navCollapsed: true
};

export function headerReducer(state = initialState, action: HeaderAction): HeaderState {
  switch (action.type) {

    case HeaderActionTypes.COLLAPSE: {
      return Object.assign({}, state, {
        navCollapsed: true
      });
    }

    case HeaderActionTypes.EXPAND: {
      return Object.assign({}, state, {
        navCollapsed: false
      });

    }

    case HeaderActionTypes.TOGGLE: {
      return Object.assign({}, state, {
        navCollapsed: !state.navCollapsed
      });

    }

    default: {
      return state;
    }
  }
}

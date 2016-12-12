import { Action } from "@ngrx/store";
import { HeaderActions } from "./header.actions";

export interface HeaderState {
  navCollapsed: boolean;
}

const initialState: HeaderState = {
  navCollapsed: true
};

export const headerReducer = (state = initialState, action: Action): HeaderState => {
  switch (action.type) {

    case HeaderActions.COLLAPSE: {
      return Object.assign({}, state, {
        navCollapsed: true
      });
    }

    case HeaderActions.EXPAND: {
      return Object.assign({}, state, {
        navCollapsed: false
      });

    }

    case HeaderActions.TOGGLE: {
      return Object.assign({}, state, {
        navCollapsed: !state.navCollapsed
      });

    }

    default: {
      return state;
    }
  }
};

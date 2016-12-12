import { Action } from "@ngrx/store";
import { HostWindowActions } from "./host-window.actions";

export interface HostWindowState {
  width: number;
  height: number;
}

const initialState: HostWindowState = {
  width: null,
  height: null
};

export const hostWindowReducer = (state = initialState, action: Action): HostWindowState => {
  switch (action.type) {

    case HostWindowActions.RESIZE: {
      return Object.assign({}, state, action.payload);
    }

    default: {
      return state;
    }
  }
};

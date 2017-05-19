import { HostWindowAction, HostWindowActionTypes } from "./host-window.actions";

export interface HostWindowState {
  width: number;
  height: number;
  breakPoint: string;
}

const initialState: HostWindowState = {
  width: null,
  height: null,
  breakPoint: null
};

export const hostWindowReducer = (state = initialState, action: HostWindowAction): HostWindowState => {
  switch (action.type) {

    case HostWindowActionTypes.RESIZE: {
      return Object.assign({}, state, action.payload);
    }

    default: {
      return state;
    }
  }
};

import { combineReducers } from "@ngrx/store";
import { routerReducer, RouterState } from "@ngrx/router-store";
import { headerReducer, HeaderState } from './header/header.reducer';
import { spinnerReducer, SpinnerState } from './spinner/spinner.reducer';
import { hostWindowReducer, HostWindowState } from "./shared/host-window.reducer";

export interface AppState {
  router: RouterState;
  hostWindow: HostWindowState;
  header: HeaderState;
  spinner: SpinnerState;
}

export const reducers = {
  router: routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer,
  spinner: spinnerReducer
};

export function rootReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}

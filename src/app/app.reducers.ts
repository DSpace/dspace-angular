import { combineReducers } from "@ngrx/store";
import { routerReducer, RouterState } from "@ngrx/router-store";
import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from "./shared/host-window.reducer";
import { CoreState, coreReducer } from "./core/core.reducers";
import { StoreActionTypes } from "./store.actions";

export interface AppState {
  core: CoreState;
  router: RouterState;
  hostWindow: HostWindowState;
  header: HeaderState;
}

export const reducers = {
  core: coreReducer,
  router: routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer
};

export function rootReducer(state: any, action: any) {
  if (action.type === StoreActionTypes.REHYDRATE) {
    state = action.payload;
  }
  return combineReducers(reducers)(state, action);
}

export const NGRX_CACHE_KEY = "NGRX_STORE";

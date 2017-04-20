import { combineReducers } from "@ngrx/store";
import { routerReducer, RouterState } from "@ngrx/router-store";
import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from "./shared/host-window.reducer";
import { CoreState, coreReducer } from "./core/core.reducers";
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from "@ngrx/core";
import { StoreActionTypes } from "./store.actions";

import { EnvConfig } from '../config';

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
  let output;
  if (action.type === StoreActionTypes.REHYDRATE) {
    state = action.payload;
  }
  if (EnvConfig.production) {
    output = combineReducers(reducers)(state, action);
  } else {
    output = compose(storeFreeze, combineReducers)(reducers)(state, action);
  }
  return output;
}

export const NGRX_CACHE_KEY = "NGRX_STORE";

import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  header: HeaderState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer
};

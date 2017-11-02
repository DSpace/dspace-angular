import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';
import { universalReducer, UniversalState } from './universal.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  header: HeaderState;
  universal: UniversalState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer,
  universal: universalReducer,
};

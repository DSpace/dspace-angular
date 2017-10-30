import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';
import {
  SearchSidebarState,
  sidebarReducer
} from './+search-page/search-sidebar/search-sidebar.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  header: HeaderState;
  searchSidebar: SearchSidebarState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer,
  searchSidebar: sidebarReducer,
};

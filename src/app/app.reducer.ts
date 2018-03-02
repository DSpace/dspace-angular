import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';
import {
  SearchSidebarState,
  sidebarReducer
} from './+search-page/search-sidebar/search-sidebar.reducer';
import {
  filterReducer,
  SearchFiltersState
} from './+search-page/search-filters/search-filter/search-filter.reducer';
import { notificationsReducer, NotificationsState } from './shared/notifications/notifications.reducers';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  header: HeaderState;
  notifications: NotificationsState;
  searchSidebar: SearchSidebarState;
  searchFilter: SearchFiltersState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer,
  notifications: notificationsReducer,
  searchSidebar: sidebarReducer,
  searchFilter: filterReducer
};

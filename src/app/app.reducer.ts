import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { headerReducer, HeaderState } from './header/header.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';
import { formReducer, FormState } from './shared/form/form.reducers';
import {
  SearchSidebarState,
  sidebarReducer
} from './+search-page/search-sidebar/search-sidebar.reducer';
import {
  filterReducer,
  SearchFiltersState
} from './+search-page/search-filters/search-filter/search-filter.reducer';
import { notificationsReducer, NotificationsState } from './shared/notifications/notifications.reducers';
import { truncatableReducer, TruncatablesState } from './shared/truncatable/truncatable.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  header: HeaderState;
  forms: FormState;
  notifications: NotificationsState;
  searchSidebar: SearchSidebarState;
  searchFilter: SearchFiltersState;
  truncatable: TruncatablesState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  header: headerReducer,
  forms: formReducer,
  notifications: notificationsReducer,
  searchSidebar: sidebarReducer,
  searchFilter: filterReducer,
  truncatable: truncatableReducer
};

export const routerStateSelector = (state: AppState) => state.router;

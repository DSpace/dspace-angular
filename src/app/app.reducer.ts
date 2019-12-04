import { ActionReducerMap, createSelector, MemoizedSelector, State } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { CommunityListReducer, CommunityListState } from './community-list-page/community-list.reducer';
import { hostWindowReducer, HostWindowState } from './shared/host-window.reducer';
import { formReducer, FormState } from './shared/form/form.reducer';
import {
  SidebarState,
  sidebarReducer
} from './shared/sidebar/sidebar.reducer';
import {
  SidebarFilterState,
  sidebarFilterReducer, SidebarFiltersState
} from './shared/sidebar/filter/sidebar-filter.reducer';
import {
  filterReducer,
  SearchFiltersState
} from './+search-page/search-filters/search-filter/search-filter.reducer';
import {
  notificationsReducer,
  NotificationsState
} from './shared/notifications/notifications.reducers';
import { truncatableReducer, TruncatablesState } from './shared/truncatable/truncatable.reducer';
import {
  metadataRegistryReducer,
  MetadataRegistryState
} from './+admin/admin-registries/metadata-registry/metadata-registry.reducers';
import { hasValue } from './shared/empty.util';
import { cssVariablesReducer, CSSVariablesState } from './shared/sass-helper/sass-helper.reducer';
import { menusReducer, MenusState } from './shared/menu/menu.reducer';
import { historyReducer, HistoryState } from './shared/history/history.reducer';
import {
  bitstreamFormatReducer,
  BitstreamFormatRegistryState
} from './+admin/admin-registries/bitstream-formats/bitstream-format.reducers';
import { ObjectSelectionListState, objectSelectionReducer } from './shared/object-select/object-select.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  history: HistoryState;
  hostWindow: HostWindowState;
  forms: FormState;
  metadataRegistry: MetadataRegistryState;
  bitstreamFormats: BitstreamFormatRegistryState;
  notifications: NotificationsState;
  sidebar: SidebarState;
  sidebarFilter: SidebarFiltersState;
  searchFilter: SearchFiltersState;
  truncatable: TruncatablesState;
  cssVariables: CSSVariablesState;
  menus: MenusState;
  objectSelection: ObjectSelectionListState;
  communityList: CommunityListState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  history: historyReducer,
  hostWindow: hostWindowReducer,
  forms: formReducer,
  metadataRegistry: metadataRegistryReducer,
  bitstreamFormats: bitstreamFormatReducer,
  notifications: notificationsReducer,
  sidebar: sidebarReducer,
  sidebarFilter: sidebarFilterReducer,
  searchFilter: filterReducer,
  truncatable: truncatableReducer,
  cssVariables: cssVariablesReducer,
  menus: menusReducer,
  objectSelection: objectSelectionReducer,
  communityList: CommunityListReducer,
};

export const routerStateSelector = (state: AppState) => state.router;

export function keySelector<T>(key: string, selector): MemoizedSelector<AppState, T> {
  return createSelector(selector, (state) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}

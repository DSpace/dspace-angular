import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ePeopleRegistryReducer,
  EPeopleRegistryState
} from './access-control/epeople-registry/epeople-registry.reducers';
import {
  groupRegistryReducer,
  GroupRegistryState
} from './access-control/group-registry/group-registry.reducers';
import {
  metadataRegistryReducer,
  MetadataRegistryState
} from './admin/admin-registries/metadata-registry/metadata-registry.reducers';
import {
  CommunityListReducer,
  CommunityListState
} from './community-list-page/community-list.reducer';
import { hasValue } from './shared/empty.util';
import {
  NameVariantListsState,
  nameVariantReducer
} from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/name-variant.reducer';
import { formReducer, FormState } from './shared/form/form.reducer';
import { menusReducer} from './shared/menu/menu.reducer';
import {
  notificationsReducer,
  NotificationsState
} from './shared/notifications/notifications.reducers';
import {
  selectableListReducer,
  SelectableListsState
} from './shared/object-list/selectable-list/selectable-list.reducer';
import {
  ObjectSelectionListState,
  objectSelectionReducer
} from './shared/object-select/object-select.reducer';
import { cssVariablesReducer, CSSVariablesState } from './shared/sass-helper/sass-helper.reducer';

import { hostWindowReducer, HostWindowState } from './shared/search/host-window.reducer';
import {
  filterReducer,
  SearchFiltersState
} from './shared/search/search-filters/search-filter/search-filter.reducer';
import {
  sidebarFilterReducer,
  SidebarFiltersState
} from './shared/sidebar/filter/sidebar-filter.reducer';
import { sidebarReducer, SidebarState } from './shared/sidebar/sidebar.reducer';
import { truncatableReducer, TruncatablesState } from './shared/truncatable/truncatable.reducer';
import { ThemeState, themeReducer } from './shared/theme-support/theme.reducer';
import { MenusState } from './shared/menu/menus-state.model';
import { correlationIdReducer } from './correlation-id/correlation-id.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  hostWindow: HostWindowState;
  forms: FormState;
  metadataRegistry: MetadataRegistryState;
  notifications: NotificationsState;
  sidebar: SidebarState;
  sidebarFilter: SidebarFiltersState;
  searchFilter: SearchFiltersState;
  truncatable: TruncatablesState;
  cssVariables: CSSVariablesState;
  theme: ThemeState;
  menus: MenusState;
  objectSelection: ObjectSelectionListState;
  selectableLists: SelectableListsState;
  relationshipLists: NameVariantListsState;
  communityList: CommunityListState;
  epeopleRegistry: EPeopleRegistryState;
  groupRegistry: GroupRegistryState;
  correlationId: string;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  hostWindow: hostWindowReducer,
  forms: formReducer,
  metadataRegistry: metadataRegistryReducer,
  notifications: notificationsReducer,
  sidebar: sidebarReducer,
  sidebarFilter: sidebarFilterReducer,
  searchFilter: filterReducer,
  truncatable: truncatableReducer,
  cssVariables: cssVariablesReducer,
  theme: themeReducer,
  menus: menusReducer,
  objectSelection: objectSelectionReducer,
  selectableLists: selectableListReducer,
  relationshipLists: nameVariantReducer,
  communityList: CommunityListReducer,
  epeopleRegistry: ePeopleRegistryReducer,
  groupRegistry: groupRegistryReducer,
  correlationId: correlationIdReducer
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

export const storeModuleConfig = {
  runtimeChecks: {
    strictStateImmutability: true,
    strictActionImmutability: true
  }
};

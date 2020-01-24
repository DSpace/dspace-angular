import { ActionReducerMap, createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { hostWindowReducer, HostWindowState } from './shared/search/host-window.reducer';
import { CommunityListReducer, CommunityListState } from './community-list-page/community-list.reducer';
import { formReducer, FormState } from './shared/form/form.reducer';
import { sidebarReducer, SidebarState } from './shared/sidebar/sidebar.reducer';
import { sidebarFilterReducer, SidebarFiltersState } from './shared/sidebar/filter/sidebar-filter.reducer';
import { filterReducer, SearchFiltersState } from './shared/search/search-filters/search-filter/search-filter.reducer';
import { notificationsReducer, NotificationsState } from './shared/notifications/notifications.reducers';
import { truncatableReducer, TruncatablesState } from './shared/truncatable/truncatable.reducer';
import {
  metadataRegistryReducer,
  MetadataRegistryState
} from './+admin/admin-registries/metadata-registry/metadata-registry.reducers';
import { hasValue } from './shared/empty.util';
import { cssVariablesReducer, CSSVariablesState } from './shared/sass-helper/sass-helper.reducer';
import { menusReducer, MenusState } from './shared/menu/menu.reducer';
import {
  selectableListReducer,
  SelectableListsState
} from './shared/object-list/selectable-list/selectable-list.reducer';
import { ObjectSelectionListState, objectSelectionReducer } from './shared/object-select/object-select.reducer';
import {
  NameVariantListsState,
  nameVariantReducer
} from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/name-variant.reducer';

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
  menus: MenusState;
  objectSelection: ObjectSelectionListState;
  selectableLists: SelectableListsState;
  relationshipLists: NameVariantListsState;
  communityList: CommunityListState;
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
  menus: menusReducer,
  objectSelection: objectSelectionReducer,
  selectableLists: selectableListReducer,
  relationshipLists: nameVariantReducer,
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

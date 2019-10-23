import { ActionReducerMap, createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { hostWindowReducer, HostWindowState } from './shared/search/host-window.reducer';
import { formReducer, FormState } from './shared/form/form.reducer';
import {
  SearchSidebarState,
  sidebarReducer
} from './shared/search/search-sidebar/search-sidebar.reducer';
import {
  filterReducer,
  SearchFiltersState
} from './shared/search/search-filters/search-filter/search-filter.reducer';
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
  selectableListReducer,
  SelectableListsState
} from './shared/object-list/selectable-list/selectable-list.reducer';
import {
  bitstreamFormatReducer,
  BitstreamFormatRegistryState
} from './+admin/admin-registries/bitstream-formats/bitstream-format.reducers';
import { ObjectSelectionListState, objectSelectionReducer } from './shared/object-select/object-select.reducer';
import { relationshipListReducer, RelationshipListsState } from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/relationship.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState;
  history: HistoryState;
  hostWindow: HostWindowState;
  forms: FormState;
  metadataRegistry: MetadataRegistryState;
  bitstreamFormats: BitstreamFormatRegistryState;
  notifications: NotificationsState;
  searchSidebar: SearchSidebarState;
  searchFilter: SearchFiltersState;
  truncatable: TruncatablesState;
  cssVariables: CSSVariablesState;
  menus: MenusState;
  objectSelection: ObjectSelectionListState;
  selectableLists: SelectableListsState;
  relationshipLists: RelationshipListsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  history: historyReducer,
  hostWindow: hostWindowReducer,
  forms: formReducer,
  metadataRegistry: metadataRegistryReducer,
  bitstreamFormats: bitstreamFormatReducer,
  notifications: notificationsReducer,
  searchSidebar: sidebarReducer,
  searchFilter: filterReducer,
  truncatable: truncatableReducer,
  cssVariables: cssVariablesReducer,
  menus: menusReducer,
  objectSelection: objectSelectionReducer,
  selectableLists: selectableListReducer,
  relationshipLists: relationshipListReducer
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

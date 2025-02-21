import { hasValue } from '@dspace/shared/utils';
import {
  routerReducer,
  RouterReducerState,
} from '@ngrx/router-store';
import {
  ActionReducerMap,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import {
  CommunityListReducer,
  CommunityListState,
} from './community-list-page/community-list.reducer';
import {
  notificationsReducer,
  NotificationsState,
} from '../../modules/core/src/lib/core/notifications/notifications.reducers';
import {
  contextHelpReducer,
  ContextHelpState,
} from './shared/context-help.reducer';
import {
  formReducer,
  FormState,
} from './shared/form/form.reducer';
import { menusReducer } from './shared/menu/menu.reducer';
import { MenusState } from './shared/menu/menus-state.model';
import {
  selectableListReducer,
  SelectableListsState,
} from './shared/object-list/selectable-list/selectable-list.reducer';
import {
  ObjectSelectionListState,
  objectSelectionReducer,
} from './shared/object-select/object-select.reducer';
import {
  cssVariablesReducer,
  CSSVariablesState,
} from './shared/sass-helper/css-variable.reducer';
import {
  hostWindowReducer,
  HostWindowState,
} from './shared/search/host-window.reducer';
import {
  filterReducer,
  SearchFiltersState,
} from './shared/search/search-filters/search-filter/search-filter.reducer';
import {
  sidebarReducer,
  SidebarState,
} from './shared/sidebar/sidebar.reducer';
import {
  themeReducer,
  ThemeState,
} from './shared/theme-support/theme.reducer';
import {
  truncatableReducer,
  TruncatablesState,
} from './shared/truncatable/truncatable.reducer';

export interface AppState {
  router: RouterReducerState;
  hostWindow: HostWindowState;
  forms: FormState;
  sidebar: SidebarState;
  searchFilter: SearchFiltersState;
  truncatable: TruncatablesState;
  cssVariables: CSSVariablesState;
  theme: ThemeState;
  menus: MenusState;
  objectSelection: ObjectSelectionListState;
  selectableLists: SelectableListsState;
  communityList: CommunityListState;
  contextHelp: ContextHelpState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  hostWindow: hostWindowReducer,
  forms: formReducer,
  sidebar: sidebarReducer,
  searchFilter: filterReducer,
  truncatable: truncatableReducer,
  cssVariables: cssVariablesReducer,
  theme: themeReducer,
  menus: menusReducer,
  objectSelection: objectSelectionReducer,
  selectableLists: selectableListReducer,
  communityList: CommunityListReducer,
  contextHelp: contextHelpReducer,
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
    strictActionImmutability: true,
  },
};

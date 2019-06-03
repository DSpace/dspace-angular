import { createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { hostWindowReducer } from './shared/host-window.reducer';
import { formReducer } from './shared/form/form.reducer';
import { sidebarReducer } from './+search-page/search-sidebar/search-sidebar.reducer';
import { filterReducer } from './+search-page/search-filters/search-filter/search-filter.reducer';
import { notificationsReducer } from './shared/notifications/notifications.reducers';
import { truncatableReducer } from './shared/truncatable/truncatable.reducer';
import { metadataRegistryReducer } from './+admin/admin-registries/metadata-registry/metadata-registry.reducers';
import { hasValue } from './shared/empty.util';
import { cssVariablesReducer } from './shared/sass-helper/sass-helper.reducer';
import { menusReducer } from './shared/menu/menu.reducer';
import { historyReducer } from './shared/history/history.reducer';
export var appReducers = {
    router: fromRouter.routerReducer,
    history: historyReducer,
    hostWindow: hostWindowReducer,
    forms: formReducer,
    metadataRegistry: metadataRegistryReducer,
    notifications: notificationsReducer,
    searchSidebar: sidebarReducer,
    searchFilter: filterReducer,
    truncatable: truncatableReducer,
    cssVariables: cssVariablesReducer,
    menus: menusReducer,
};
export var routerStateSelector = function (state) { return state.router; };
export function keySelector(key, selector) {
    return createSelector(selector, function (state) {
        if (hasValue(state)) {
            return state[key];
        }
        else {
            return undefined;
        }
    });
}
//# sourceMappingURL=app.reducer.js.map
import { SearchSidebarActionTypes } from './search-sidebar.actions';
var initialState = {
    sidebarCollapsed: true
};
/**
 * Performs a search sidebar action on the current state
 * @param {SearchSidebarState} state The state before the action is performed
 * @param {SearchSidebarAction} action The action that should be performed
 * @returns {SearchSidebarState} The state after the action is performed
 */
export function sidebarReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case SearchSidebarActionTypes.COLLAPSE: {
            return Object.assign({}, state, {
                sidebarCollapsed: true
            });
        }
        case SearchSidebarActionTypes.EXPAND: {
            return Object.assign({}, state, {
                sidebarCollapsed: false
            });
        }
        case SearchSidebarActionTypes.TOGGLE: {
            return Object.assign({}, state, {
                sidebarCollapsed: !state.sidebarCollapsed
            });
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=search-sidebar.reducer.js.map
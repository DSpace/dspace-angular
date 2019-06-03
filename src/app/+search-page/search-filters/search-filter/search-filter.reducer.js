import { SearchFilterActionTypes } from './search-filter.actions';
var initialState = Object.create(null);
/**
 * Performs a search filter action on the current state
 * @param {SearchFiltersState} state The state before the action is performed
 * @param {SearchFilterAction} action The action that should be performed
 * @returns {SearchFiltersState} The state after the action is performed
 */
export function filterReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b, _c, _d, _e, _f, _g;
    switch (action.type) {
        case SearchFilterActionTypes.INITIALIZE: {
            var initAction = action;
            return Object.assign({}, state, (_a = {},
                _a[action.filterName] = {
                    filterCollapsed: !initAction.initiallyExpanded,
                    page: 1
                },
                _a));
            return state;
        }
        case SearchFilterActionTypes.COLLAPSE: {
            return Object.assign({}, state, (_b = {},
                _b[action.filterName] = {
                    filterCollapsed: true,
                    page: state[action.filterName].page
                },
                _b));
        }
        case SearchFilterActionTypes.EXPAND: {
            return Object.assign({}, state, (_c = {},
                _c[action.filterName] = {
                    filterCollapsed: false,
                    page: state[action.filterName].page
                },
                _c));
        }
        case SearchFilterActionTypes.DECREMENT_PAGE: {
            var page = state[action.filterName].page - 1;
            return Object.assign({}, state, (_d = {},
                _d[action.filterName] = {
                    filterCollapsed: state[action.filterName].filterCollapsed,
                    page: (page >= 1 ? page : 1)
                },
                _d));
        }
        case SearchFilterActionTypes.INCREMENT_PAGE: {
            return Object.assign({}, state, (_e = {},
                _e[action.filterName] = {
                    filterCollapsed: state[action.filterName].filterCollapsed,
                    page: state[action.filterName].page + 1
                },
                _e));
        }
        case SearchFilterActionTypes.RESET_PAGE: {
            return Object.assign({}, state, (_f = {},
                _f[action.filterName] = {
                    filterCollapsed: state[action.filterName].filterCollapsed,
                    page: 1
                },
                _f));
        }
        case SearchFilterActionTypes.TOGGLE: {
            return Object.assign({}, state, (_g = {},
                _g[action.filterName] = {
                    filterCollapsed: !state[action.filterName].filterCollapsed,
                    page: state[action.filterName].page
                },
                _g));
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=search-filter.reducer.js.map
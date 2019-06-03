import { TruncatableActionTypes } from './truncatable.actions';
var initialState = Object.create(null);
/**
 * Performs a truncatable action on the current state
 * @param {TruncatablesState} state The state before the action is performed
 * @param {TruncatableAction} action The action that should be performed
 * @returns {TruncatablesState} The state after the action is performed
 */
export function truncatableReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b, _c;
    switch (action.type) {
        case TruncatableActionTypes.COLLAPSE: {
            return Object.assign({}, state, (_a = {},
                _a[action.id] = {
                    collapsed: true,
                },
                _a));
        }
        case TruncatableActionTypes.EXPAND: {
            return Object.assign({}, state, (_b = {},
                _b[action.id] = {
                    collapsed: false,
                },
                _b));
        }
        case TruncatableActionTypes.TOGGLE: {
            if (!state[action.id]) {
                state[action.id] = { collapsed: false };
            }
            return Object.assign({}, state, (_c = {},
                _c[action.id] = {
                    collapsed: !state[action.id].collapsed,
                },
                _c));
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=truncatable.reducer.js.map
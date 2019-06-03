import { IndexActionTypes } from './index.actions';
/**
 * An enum containing all index names
 */
export var IndexName;
(function (IndexName) {
    // Contains all objects in the object cache indexed by UUID
    IndexName["OBJECT"] = "object/uuid-to-self-link";
    // contains all requests in the request cache indexed by UUID
    IndexName["REQUEST"] = "get-request/href-to-uuid";
    /**
     * Contains the UUIDs of requests that were sent to the server and
     * have their responses cached, indexed by the UUIDs of requests that
     * weren't sent because the response they requested was already cached
     */
    IndexName["UUID_MAPPING"] = "get-request/configured-to-cache-uuid";
})(IndexName || (IndexName = {}));
// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
var initialState = Object.create(null);
/**
 * The Index Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return MetaIndexState
 *    the new state
 */
export function indexReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case IndexActionTypes.ADD: {
            return addToIndex(state, action);
        }
        case IndexActionTypes.REMOVE_BY_VALUE: {
            return removeFromIndexByValue(state, action);
        }
        case IndexActionTypes.REMOVE_BY_SUBSTRING: {
            return removeFromIndexBySubstring(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Add an entry to a given index
 *
 * @param state
 *    The MetaIndexState that contains all indices
 * @param action
 *    The AddToIndexAction containing the value to add, and the index to add it to
 * @return MetaIndexState
 *    the new state
 */
function addToIndex(state, action) {
    var _a, _b;
    var subState = state[action.payload.name];
    var newSubState = Object.assign({}, subState, (_a = {},
        _a[action.payload.key] = action.payload.value,
        _a));
    var obs = Object.assign({}, state, (_b = {},
        _b[action.payload.name] = newSubState,
        _b));
    return obs;
}
/**
 * Remove a entries that contain a given value from a given index
 *
 * @param state
 *    The MetaIndexState that contains all indices
 * @param action
 *    The RemoveFromIndexByValueAction containing the value to remove, and the index to remove it from
 * @return MetaIndexState
 *    the new state
 */
function removeFromIndexByValue(state, action) {
    var _a;
    var subState = state[action.payload.name];
    var newSubState = Object.create(null);
    for (var value in subState) {
        if (subState[value] !== action.payload.value) {
            newSubState[value] = subState[value];
        }
    }
    return Object.assign({}, state, (_a = {},
        _a[action.payload.name] = newSubState,
        _a));
}
/**
 * Remove entries that contain a given substring from a given index
 *
 * @param state
 *    The MetaIndexState that contains all indices
 * @param action
 *    The RemoveFromIndexByValueAction the substring to remove, and the index to remove it from
 * @return MetaIndexState
 *    the new state
 */
function removeFromIndexBySubstring(state, action) {
    var _a;
    var subState = state[action.payload.name];
    var newSubState = Object.create(null);
    for (var value in subState) {
        if (value.indexOf(action.payload.value) < 0) {
            newSubState[value] = subState[value];
        }
    }
    return Object.assign({}, state, (_a = {},
        _a[action.payload.name] = newSubState,
        _a));
}
//# sourceMappingURL=index.reducer.js.map
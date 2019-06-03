import { ObjectCacheActionTypes } from './object-cache.actions';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { applyPatch } from 'fast-json-patch';
export var DirtyType;
(function (DirtyType) {
    DirtyType["Created"] = "Created";
    DirtyType["Updated"] = "Updated";
    DirtyType["Deleted"] = "Deleted";
})(DirtyType || (DirtyType = {}));
/**
 * An entry in the ObjectCache
 */
var ObjectCacheEntry = /** @class */ (function () {
    function ObjectCacheEntry() {
        this.patches = [];
    }
    return ObjectCacheEntry;
}());
export { ObjectCacheEntry };
// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
var initialState = Object.create(null);
/**
 * The ObjectCache Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ObjectCacheState
 *    the new state
 */
export function objectCacheReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ObjectCacheActionTypes.ADD: {
            return addToObjectCache(state, action);
        }
        case ObjectCacheActionTypes.REMOVE: {
            return removeFromObjectCache(state, action);
        }
        case ObjectCacheActionTypes.RESET_TIMESTAMPS: {
            return resetObjectCacheTimestamps(state, action);
        }
        case ObjectCacheActionTypes.ADD_PATCH: {
            return addPatchObjectCache(state, action);
        }
        case ObjectCacheActionTypes.APPLY_PATCH: {
            return applyPatchObjectCache(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Add an object to the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an AddToObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object added, or overwritten.
 */
function addToObjectCache(state, action) {
    var _a;
    var existing = state[action.payload.objectToCache.self];
    return Object.assign({}, state, (_a = {},
        _a[action.payload.objectToCache.self] = {
            data: action.payload.objectToCache,
            timeAdded: action.payload.timeAdded,
            msToLive: action.payload.msToLive,
            requestUUID: action.payload.requestUUID,
            isDirty: (hasValue(existing) ? isNotEmpty(existing.patches) : false),
            patches: (hasValue(existing) ? existing.patches : [])
        },
        _a));
}
/**
 * Remove an object from the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveFromObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object removed if it existed.
 */
function removeFromObjectCache(state, action) {
    if (hasValue(state[action.payload])) {
        var newObjectCache = Object.assign({}, state);
        delete newObjectCache[action.payload];
        return newObjectCache;
    }
    else {
        return state;
    }
}
/**
 * Set the timeAdded timestamp of every cached object to the specified value
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetObjectCacheTimestampsAction
 * @return ObjectCacheState
 *    the new state, with all timeAdded timestamps set to the specified value
 */
function resetObjectCacheTimestamps(state, action) {
    var newState = Object.create(null);
    Object.keys(state).forEach(function (key) {
        newState[key] = Object.assign({}, state[key], {
            timeAdded: action.payload
        });
    });
    return newState;
}
/**
 * Add the list of patch operations to a cached object
 *
 * @param state
 *    the current state
 * @param action
 *    an AddPatchObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the new operations added to the state of the specified ObjectCacheEntry
 */
function addPatchObjectCache(state, action) {
    var uuid = action.payload.href;
    var operations = action.payload.operations;
    var newState = Object.assign({}, state);
    if (hasValue(newState[uuid])) {
        var patches = newState[uuid].patches;
        newState[uuid] = Object.assign({}, newState[uuid], {
            patches: patches.concat([{ operations: operations }]),
            isDirty: true
        });
    }
    return newState;
}
/**
 * Apply the list of patch operations to a cached object
 *
 * @param state
 *    the current state
 * @param action
 *    an ApplyPatchObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the new operations applied to the state of the specified ObjectCacheEntry
 */
function applyPatchObjectCache(state, action) {
    var uuid = action.payload;
    var newState = Object.assign({}, state);
    if (hasValue(newState[uuid])) {
        // flatten two dimensional array
        var flatPatch = [].concat.apply([], newState[uuid].patches.map(function (patch) { return patch.operations; }));
        var newData = applyPatch(newState[uuid].data, flatPatch, undefined, false);
        newState[uuid] = Object.assign({}, newState[uuid], { data: newData.newDocument, patches: [] });
    }
    return newState;
}
//# sourceMappingURL=object-cache.reducer.js.map
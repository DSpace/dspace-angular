import { RequestActionTypes } from './request.actions';
var RequestEntry = /** @class */ (function () {
    function RequestEntry() {
    }
    return RequestEntry;
}());
export { RequestEntry };
// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
var initialState = Object.create(null);
export function requestReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case RequestActionTypes.CONFIGURE: {
            return configureRequest(state, action);
        }
        case RequestActionTypes.EXECUTE: {
            return executeRequest(state, action);
        }
        case RequestActionTypes.COMPLETE: {
            return completeRequest(state, action);
        }
        case RequestActionTypes.RESET_TIMESTAMPS: {
            return resetResponseTimestamps(state, action);
        }
        case RequestActionTypes.REMOVE: {
            return removeRequest(state, action);
        }
        default: {
            return state;
        }
    }
}
function configureRequest(state, action) {
    var _a;
    return Object.assign({}, state, (_a = {},
        _a[action.payload.uuid] = {
            request: action.payload,
            requestPending: true,
            responsePending: false,
            completed: false,
        },
        _a));
}
function executeRequest(state, action) {
    var _a;
    var obs = Object.assign({}, state, (_a = {},
        _a[action.payload] = Object.assign({}, state[action.payload], {
            requestPending: false,
            responsePending: true
        }),
        _a));
    return obs;
}
/**
 * Update a request with the response
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCompleteAction
 * @return RequestState
 *    the new state, with the response added to the request
 */
function completeRequest(state, action) {
    var _a;
    var time = new Date().getTime();
    return Object.assign({}, state, (_a = {},
        _a[action.payload.uuid] = Object.assign({}, state[action.payload.uuid], {
            responsePending: false,
            completed: true,
            response: Object.assign({}, action.payload.response, { timeAdded: time })
        }),
        _a));
}
/**
 * Reset the timeAdded property of all responses
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCompleteAction
 * @return RequestState
 *    the new state, with the timeAdded property reset
 */
function resetResponseTimestamps(state, action) {
    var newState = Object.create(null);
    Object.keys(state).forEach(function (key) {
        newState[key] = Object.assign({}, state[key], { response: Object.assign({}, state[key].response, { timeAdded: action.payload }) });
    });
    return newState;
}
/**
 * Remove a request from the RequestState
 * @param state   The current RequestState
 * @param action  The RequestRemoveAction to perform
 */
function removeRequest(state, action) {
    var newState = Object.create(null);
    for (var value in state) {
        if (value !== action.uuid) {
            newState[value] = state[value];
        }
    }
    return newState;
}
//# sourceMappingURL=request.reducer.js.map
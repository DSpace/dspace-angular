import { hasValue, isNotEmpty, isNotUndefined, isNull } from '../../shared/empty.util';
import { JsonPatchOperationsActionTypes } from './json-patch-operations.actions';
import { JsonPatchOperationType } from './json-patch.model';
var initialState = Object.create(null);
/**
 * The JSON-PATCH operations Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return JsonPatchOperationsState
 *    the new state
 */
export function jsonPatchOperationsReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS: {
            return commitOperations(state, action);
        }
        case JsonPatchOperationsActionTypes.FLUSH_JSON_PATCH_OPERATIONS: {
            return flushOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION: {
            return newOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_COPY_OPERATION: {
            return newOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_MOVE_OPERATION: {
            return newOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION: {
            return newOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION: {
            return newOperation(state, action);
        }
        case JsonPatchOperationsActionTypes.ROLLBACK_JSON_PATCH_OPERATIONS: {
            return rollbackOperations(state, action);
        }
        case JsonPatchOperationsActionTypes.START_TRANSACTION_JSON_PATCH_OPERATIONS: {
            return startTransactionPatchOperations(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Set the transaction start time.
 *
 * @param state
 *    the current state
 * @param action
 *    an StartTransactionPatchOperationsAction
 * @return JsonPatchOperationsState
 *    the new state.
 */
function startTransactionPatchOperations(state, action) {
    var _a;
    if (hasValue(state[action.payload.resourceType])
        && isNull(state[action.payload.resourceType].transactionStartTime)) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.resourceType] = Object.assign({}, state[action.payload.resourceType], {
                transactionStartTime: action.payload.startTime,
                commitPending: true
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set commit pending state.
 *
 * @param state
 *    the current state
 * @param action
 *    an CommitPatchOperationsAction
 * @return JsonPatchOperationsState
 *    the new state, with the section new validity status.
 */
function commitOperations(state, action) {
    var _a;
    if (hasValue(state[action.payload.resourceType])
        && state[action.payload.resourceType].commitPending) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.resourceType] = Object.assign({}, state[action.payload.resourceType], {
                commitPending: false
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set commit pending state.
 *
 * @param state
 *    the current state
 * @param action
 *    an RollbacktPatchOperationsAction
 * @return JsonPatchOperationsState
 *    the new state.
 */
function rollbackOperations(state, action) {
    var _a;
    if (hasValue(state[action.payload.resourceType])
        && state[action.payload.resourceType].commitPending) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.resourceType] = Object.assign({}, state[action.payload.resourceType], {
                transactionStartTime: null,
                commitPending: false
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Add new JSON patch operation list.
 *
 * @param state
 *    the current state
 * @param action
 *    an NewPatchAddOperationAction
 * @return JsonPatchOperationsState
 *    the new state, with the section new validity status.
 */
function newOperation(state, action) {
    var _a, _b, _c, _d;
    var newState = Object.assign({}, state);
    var body = hasValidBody(newState, action.payload.resourceType, action.payload.resourceId)
        ? newState[action.payload.resourceType].children[action.payload.resourceId].body : Array.of();
    var newBody = addOperationToList(body, action.type, action.payload.path, hasValue(action.payload.value) ? action.payload.value : null);
    if (hasValue(newState[action.payload.resourceType])
        && hasValue(newState[action.payload.resourceType].children)) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.resourceType] = Object.assign({}, state[action.payload.resourceType], {
                children: Object.assign({}, state[action.payload.resourceType].children, (_b = {},
                    _b[action.payload.resourceId] = {
                        body: newBody,
                    },
                    _b)),
                commitPending: isNotUndefined(state[action.payload.resourceType].commitPending) ? state[action.payload.resourceType].commitPending : false
            }),
            _a));
    }
    else {
        return Object.assign({}, state, (_c = {},
            _c[action.payload.resourceType] = Object.assign({}, {
                children: (_d = {},
                    _d[action.payload.resourceId] = {
                        body: newBody,
                    },
                    _d),
                transactionStartTime: null,
                commitPending: false
            }),
            _c));
    }
}
/**
 * Check if state has a valid body.
 *
 * @param state
 *    the current state
 * @param resourceType
 *    an resource type
 * @param resourceId
 *    an resource ID
 * @return boolean
 */
function hasValidBody(state, resourceType, resourceId) {
    return (hasValue(state[resourceType])
        && hasValue(state[resourceType].children)
        && hasValue(state[resourceType].children[resourceId])
        && isNotEmpty(state[resourceType].children[resourceId].body));
}
/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an FlushPatchOperationsAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function flushOperation(state, action) {
    var _a, _b;
    if (hasValue(state[action.payload.resourceType])) {
        var newChildren_1;
        if (isNotUndefined(action.payload.resourceId)) {
            // flush only specified child's operations
            if (hasValue(state[action.payload.resourceType].children)
                && hasValue(state[action.payload.resourceType].children[action.payload.resourceId])) {
                newChildren_1 = Object.assign({}, state[action.payload.resourceType].children, (_a = {},
                    _a[action.payload.resourceId] = {
                        body: state[action.payload.resourceType].children[action.payload.resourceId].body
                            .filter(function (entry) { return entry.timeAdded > state[action.payload.resourceType].transactionStartTime; })
                    },
                    _a));
            }
            else {
                newChildren_1 = state[action.payload.resourceType].children;
            }
        }
        else {
            // flush all children's operations
            newChildren_1 = state[action.payload.resourceType].children;
            Object.keys(newChildren_1)
                .forEach(function (resourceId) {
                var _a;
                newChildren_1 = Object.assign({}, newChildren_1, (_a = {},
                    _a[resourceId] = {
                        body: newChildren_1[resourceId].body
                            .filter(function (entry) { return entry.timeAdded > state[action.payload.resourceType].transactionStartTime; })
                    },
                    _a));
            });
        }
        return Object.assign({}, state, (_b = {},
            _b[action.payload.resourceType] = Object.assign({}, state[action.payload.resourceType], {
                children: newChildren_1,
                transactionStartTime: null,
            }),
            _b));
    }
    else {
        return state;
    }
}
function addOperationToList(body, actionType, targetPath, value) {
    var newBody = Array.from(body);
    switch (actionType) {
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION:
            newBody.push(makeOperationEntry({
                op: JsonPatchOperationType.add,
                path: targetPath,
                value: value
            }));
            break;
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION:
            newBody.push(makeOperationEntry({
                op: JsonPatchOperationType.replace,
                path: targetPath,
                value: value
            }));
            break;
        case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION:
            newBody.push(makeOperationEntry({ op: JsonPatchOperationType.remove, path: targetPath }));
            break;
    }
    return newBody;
}
function makeOperationEntry(operation) {
    return { operation: operation, timeAdded: new Date().getTime() };
}
//# sourceMappingURL=json-patch-operations.reducer.js.map
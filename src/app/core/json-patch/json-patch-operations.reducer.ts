import { hasValue, isNotEmpty, isNotUndefined, isNull } from '../../shared/empty.util';

import {
  FlushPatchOperationsAction,
  PatchOperationsActions,
  JsonPatchOperationsActionTypes,
  NewPatchAddOperationAction,
  NewPatchCopyOperationAction,
  NewPatchMoveOperationAction,
  NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction,
  CommitPatchOperationsAction,
  StartTransactionPatchOperationsAction,
  RollbacktPatchOperationsAction
} from './json-patch-operations.actions';
import { JsonPatchOperationModel, JsonPatchOperationType } from './json-patch.model';

export interface JsonPatchOperationObject {
  operation: JsonPatchOperationModel;
  timeAdded: number;
}

export interface JsonPatchOperationsEntry {
  body: JsonPatchOperationObject[];
}

export interface JsonPatchOperationsResourceEntry {
  children: { [resourceId: string]: JsonPatchOperationsEntry };
  transactionStartTime: number;
  commitPending: boolean;
}

/**
 * The JSON patch operations State
 *
 * Consists of a map with a namespace as key,
 * and an array of JsonPatchOperationModel as values
 */
export interface JsonPatchOperationsState {
  [resourceType: string]: JsonPatchOperationsResourceEntry;
}

const initialState: JsonPatchOperationsState = Object.create(null);

export function jsonPatchOperationsReducer(state = initialState, action: PatchOperationsActions): JsonPatchOperationsState {
  switch (action.type) {

    case JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS: {
      return commitOperations(state, action as CommitPatchOperationsAction);
    }

    case JsonPatchOperationsActionTypes.FLUSH_JSON_PATCH_OPERATIONS: {
      return flushOperation(state, action as FlushPatchOperationsAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION: {
      return newOperation(state, action as NewPatchAddOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_COPY_OPERATION: {
      return newOperation(state, action as NewPatchCopyOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_MOVE_OPERATION: {
      return newOperation(state, action as NewPatchMoveOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION: {
      return newOperation(state, action as NewPatchRemoveOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION: {
      return newOperation(state, action as NewPatchReplaceOperationAction);
    }

    case JsonPatchOperationsActionTypes.ROLLBACK_JSON_PATCH_OPERATIONS: {
      return rollbackOperations(state, action as RollbacktPatchOperationsAction);
    }

    case JsonPatchOperationsActionTypes.START_TRANSACTION_JSON_PATCH_OPERATIONS: {
      return startTransactionPatchOperations(state, action as StartTransactionPatchOperationsAction);
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
function startTransactionPatchOperations(state: JsonPatchOperationsState, action: StartTransactionPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[ action.payload.resourceType ])
    && isNull(state[ action.payload.resourceType ].transactionStartTime)) {
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, state[ action.payload.resourceType ], {
        children: state[ action.payload.resourceType ].children,
        transactionStartTime: action.payload.startTime,
        commitPending: true
      })
    });
  } else {
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
function commitOperations(state: JsonPatchOperationsState, action: CommitPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[ action.payload.resourceType ])
    && state[ action.payload.resourceType ].commitPending) {
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, state[ action.payload.resourceType ], {
        children: state[ action.payload.resourceType ].children,
        transactionStartTime: state[ action.payload.resourceType ].transactionStartTime,
        commitPending: false
      })
    });
  } else {
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
function rollbackOperations(state: JsonPatchOperationsState, action: RollbacktPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[ action.payload.resourceType ])
    && state[ action.payload.resourceType ].commitPending) {
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, state[ action.payload.resourceType ], {
        children: state[ action.payload.resourceType ].children,
        transactionStartTime: null,
        commitPending: false
      })
    });
  } else {
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
function newOperation(state: JsonPatchOperationsState, action): JsonPatchOperationsState {
  const newState = Object.assign({}, state);
  const newBody = buildOperationsList(
    (hasValue(newState[ action.payload.resourceType ])
      && hasValue(newState[ action.payload.resourceType ].children)
      && hasValue(newState[ action.payload.resourceType ].children[ action.payload.resourceId ])
      && isNotEmpty(newState[ action.payload.resourceType ].children[ action.payload.resourceId ].body))
      ? newState[ action.payload.resourceType ].children[ action.payload.resourceId ].body : Array.of(),
    action.type,
    action.payload.path,
    hasValue(action.payload.value) ? action.payload.value : null);

  if (hasValue(newState[ action.payload.resourceType ])
    && hasValue(newState[ action.payload.resourceType ].children)) {
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, state[ action.payload.resourceType ], {
        children: Object.assign({}, state[ action.payload.resourceType ].children, {
          [action.payload.resourceId]: {
            body: newBody,
          }
        }),
        transactionStartTime: state[ action.payload.resourceType ].transactionStartTime,
        commitPending: state[ action.payload.resourceType ].commitPending
      })
    });
    /*} else if (hasValue(newState[action.payload.resourceType])) {
      return Object.assign({}, state, {
        [action.payload.resourceType]: Object.assign({}, state[action.payload.resourceType],{
          [action.payload.resourceId]: {
            body: newBody,
            transactionStartTime: null,
            commitPending: false
          }
        })
      });*/
  } else {
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, {
        children: {
          [action.payload.resourceId]: {
            body: newBody,
          }
        },
        transactionStartTime: null,
        commitPending: false
      })
    });
  }
}

/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an LoadSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function flushOperation(state: JsonPatchOperationsState, action: FlushPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[ action.payload.resourceType ])) {
    let newChildren;
    if (isNotUndefined(action.payload.resourceId)) {
      // flush only specified child's operations
      if (hasValue(state[ action.payload.resourceType ].children)
        && hasValue(state[ action.payload.resourceType ].children[ action.payload.resourceId ])) {
        newChildren = Object.assign({}, state[ action.payload.resourceType ].children, {
          [action.payload.resourceId]: {
            body: state[ action.payload.resourceType ].children[ action.payload.resourceId ].body
              .filter((entry) => entry.timeAdded > state[ action.payload.resourceType ].transactionStartTime)
          }
        });
      } else {
        newChildren = state[ action.payload.resourceType ].children;
      }
    } else {
      // flush all children's operations
      newChildren = state[ action.payload.resourceType ].children;
      Object.keys(newChildren)
        .forEach((resourceId) => {
          newChildren = Object.assign({}, newChildren, {
            [resourceId]: {
              body: newChildren[ resourceId ].body
                .filter((entry) => entry.timeAdded > state[ action.payload.resourceType ].transactionStartTime)
            }
          });
        })
    }
    return Object.assign({}, state, {
      [action.payload.resourceType]: Object.assign({}, state[ action.payload.resourceType ], {
        children: newChildren,
        transactionStartTime: null,
        commitPending: state[ action.payload.resourceType ].commitPending
      })
    });
  } else {
    return state;
  }
}

function buildOperationsList(body: JsonPatchOperationObject[], actionType, targetPath, value?) {
  switch (actionType) {
    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION:
      let doAdd = true;
      if (body.length > 0) {
        let previousTotal = body.length;
        // Remove the REMOVE duplication
        const oriBody = body;
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.remove, targetPath));
        if (previousTotal !== body.length) {
          const removes = oriBody.filter((element) => patchBodyFilterOperations(element.operation,
            JsonPatchOperationType.remove,
            targetPath,
            true));
          const removeValue = removes[ (removes.length - 1) ].operation.value;
          // The ADD became a REPLACE
          body.push(makeOperationEntry({
            op: JsonPatchOperationType.replace,
            path: targetPath,
            value: removeValue
          }));
          doAdd = false;
        }
        if (doAdd) {
          previousTotal = body.length;
          // Remove the REPLACE duplication
          body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.replace, targetPath));
          if (previousTotal !== body.length) {
            // The ADD became a REPLACE
            body.push(makeOperationEntry({
              op: JsonPatchOperationType.replace,
              path: targetPath,
              value: value
            }));
            doAdd = false;
          }
        }
        // Remove the ADD duplication
        // The ADD operation can't be deduplicated
        // body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.add, targetPath));
      }
      if (doAdd) {
        body.push(makeOperationEntry({
          op: JsonPatchOperationType.add,
          path: targetPath,
          value: value
        }));
      }
      break;
    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION:
      let doReplace = true;
      if (body.length > 0) {
        // Remove the REMOVE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.remove, targetPath));
        const previousTotal = body.length;
        // Remove the ADD duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.add, targetPath));
        if (previousTotal !== body.length) {
          // Replace the removed ADD
          body.push(makeOperationEntry({
            op: JsonPatchOperationType.add,
            path: targetPath,
            value: value
          }));
          doReplace = false;
        }
        // Replace the REPLACE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.replace, targetPath));
      }
      if (doReplace) {
        body.push(makeOperationEntry({
          op: JsonPatchOperationType.replace,
          path: targetPath,
          value: value
        }));
      }
      break;
    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION:
      let doRemove = true;
      if (body.length > 0) {
        const previousTotal = body.length;
        // Remove the ADD duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.add, targetPath));
        if (previousTotal !== body.length) {
          // The REMOVE is cancelled
          doRemove = false;
        }
        // Remove the REPLACE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.replace, targetPath));
        // Remove the REMOVE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, JsonPatchOperationType.remove, targetPath));
      }
      if (doRemove) {
        body.push(makeOperationEntry({ op: JsonPatchOperationType.remove, path: targetPath }));
      }
      break;
  }
  return body;
}

function patchBodyFilterOperations(element, operation, targetPath, inverse?) {
  if (inverse === true) {
    return (element.op === operation && element.path === targetPath);
  } else {
    return !(element.op === operation && element.path === targetPath);
  }
}

function makeOperationEntry(operation) {
  return { operation: operation, timeAdded: new Date().getTime() };
}

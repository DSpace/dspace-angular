import { hasValue, isNotEmpty, isUndefined } from '../../shared/empty.util';

import {
  FlushPatchOperationsAction,
  PatchOperationsActions, JsonPatchOperationsActionTypes, NewPatchAddOperationAction, NewPatchCopyOperationAction,
  NewPatchMoveOperationAction, NewPatchRemoveOperationAction, NewPatchReplaceOperationAction,
  CommitPatchOperationsAction, StartTransactionPatchOperationsAction, RollbacktPatchOperationsAction
} from './patch-operations.actions';
import { PatchOperationModel, PatchOperationType } from '../shared/patch-request.model';

export interface JsonPatchOperationObject {
  operation: PatchOperationModel;
  timeAdded: number;
}

export interface JsonPatchOperationsEntry {
  body: JsonPatchOperationObject[];
  transactionStartTime: number;
  commitPending: boolean;
}

/**
 * The JSON patch operations State
 *
 * Consists of a map with a namespace as key,
 * and an array of PatchOperationModel as values
 */
export interface JsonPatchOperationsState {
  [namespace: string]: JsonPatchOperationsEntry;
}

const initialState: JsonPatchOperationsState = Object.create(null);

export function jsonPatchOperationsReducer(state = initialState, action: PatchOperationsActions): JsonPatchOperationsState {
  switch (action.type) {

    case JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS: {
      return endTransactionOperations(state, action as CommitPatchOperationsAction);
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
      return endTransactionOperations(state, action as RollbacktPatchOperationsAction);
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
  if (hasValue(state[action.payload.namespace]) && isUndefined(hasValue(state[action.payload.namespace].transactionStartTime))) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, state[action.payload.namespace], {
        body: state[action.payload.namespace].body,
        transactionStartTime: action.payload.startTime,
        commitPending: true
      })
    });
  } else {
    return state;
  }
}

/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an CommitPatchOperationsAction
 * @return JsonPatchOperationsState
 *    the new state, with the section new validity status.
 */
function endTransactionOperations(state: JsonPatchOperationsState, action: CommitPatchOperationsAction|RollbacktPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[action.payload.namespace]) && state[action.payload.namespace].commitPending) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, state[action.payload.namespace], {
        body: state[action.payload.namespace].body,
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
    (hasValue(newState[action.payload.namespace]) && isNotEmpty(newState[action.payload.namespace].body))
      ? newState[action.payload.namespace].body : Array.of(),
    action.type,
    action.payload.path,
    hasValue(action.payload.value) ? action.payload.value : null);
  if (hasValue(state[action.payload.namespace])) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, state[action.payload.namespace], {
        body: newBody,
        transactionStartTime: state[action.payload.namespace].transactionStartTime,
        commitPending: state[action.payload.namespace].commitPending
      })
    });
  } else {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, {
        body: newBody,
        transactionStartTime: state[action.payload.namespace].transactionStartTime,
        commitPending: state[action.payload.namespace].commitPending
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
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function flushOperation(state: JsonPatchOperationsState, action: FlushPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[action.payload.namespace]) && hasValue(state[action.payload.namespace].transactionStartTime)
    && !(state[action.payload.namespace].commitPending)) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, {
        body: state[action.payload.namespace].body.filter((entry) => entry.timeAdded > state[action.payload.namespace].transactionStartTime),
        transactionStartTime: null,
        commitPending: state[action.payload.namespace].commitPending
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
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.remove, targetPath));
        if (previousTotal !== body.length) {
          const removes = oriBody.filter((element) => patchBodyFilterOperations(element.operation,
            PatchOperationType.remove,
            targetPath,
            true));
          const removeValue = removes[(removes.length - 1)].operation.value;
          // The ADD became a REPLACE
          body.push(makeOperationEntry({op: PatchOperationType.replace, path: targetPath, value: removeValue}));
          doAdd = false;
        }
        if (doAdd) {
          previousTotal = body.length;
          // Remove the REPLACE duplication
          body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.replace, targetPath));
          if (previousTotal !== body.length) {
            // The ADD became a REPLACE
            body.push(makeOperationEntry({op: PatchOperationType.replace, path: targetPath, value: value}));
            doAdd = false;
          }
        }
        // Remove the ADD duplication
        // The ADD operation can't be deduplicated
        // body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.add, targetPath));
      }
      if (doAdd) {
        body.push(makeOperationEntry({op: PatchOperationType.add, path: targetPath, value: value}));
      }
      break;
    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION:
      let doReplace = true;
      if (body.length > 0) {
        // Remove the REMOVE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.remove, targetPath));
        const previousTotal = body.length;
        // Remove the ADD duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.add, targetPath));
        if (previousTotal !== body.length) {
          // Replace the removed ADD
          body.push(makeOperationEntry({op: PatchOperationType.add, path: targetPath, value: value}));
          doReplace = false;
        }
        // Replace the REPLACE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.replace, targetPath));
      }
      if (doReplace) {
        body.push(makeOperationEntry({op: PatchOperationType.replace, path: targetPath, value: value}));
      }
      break;
    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION:
      let doRemove = true;
      if (body.length > 0) {
        const previousTotal = body.length;
        // Remove the ADD duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.add, targetPath));
        if (previousTotal !== body.length) {
          // The REMOVE is cancelled
          doRemove = false;
        }
        // Remove the REPLACE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.replace, targetPath));
        // Remove the REMOVE duplication
        body = body.filter((element) => patchBodyFilterOperations(element.operation, PatchOperationType.remove, targetPath));
      }
      if (doRemove) {
        body.push(makeOperationEntry({op: PatchOperationType.remove, path: targetPath}));
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
  return {operation: operation, timeAdded: new Date().getTime()};
}

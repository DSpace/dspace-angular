import { hasValue } from '../../shared/empty.util';

import {
  FlushPatchOperationsAction,
  PatchOperationsActions, JsonPatchOperationsActionTypes, NewPatchAddOperationAction, NewPatchCopyOperationAction,
  NewPatchMoveOperationAction, NewPatchRemoveOperationAction, NewPatchReplaceOperationAction
} from './patch-operations.actions';
import { PatchOperationModel } from '../shared/patch-request.model';

/**
 * The JSON patch operations State
 *
 * Consists of a map with a namespace as key,
 * and an array of PatchOperationModel as values
 */
export interface JsonPatchOperationsState {
  [namespace: string]: PatchOperationModel[];
}

const initialState: JsonPatchOperationsState = Object.create(null);

export function jsonPatchOperationsReducer(state = initialState, action: PatchOperationsActions): JsonPatchOperationsState {
  switch (action.type) {

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION: {
      return newPatchOperation(state, action as NewPatchAddOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_COPY_OPERATION: {
      return newPatchOperation(state, action as NewPatchCopyOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_MOVE_OPERATION: {
      return newPatchOperation(state, action as NewPatchMoveOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION: {
      return newPatchOperation(state, action as NewPatchRemoveOperationAction);
    }

    case JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION: {
      return newPatchOperation(state, action as NewPatchReplaceOperationAction);
    }

    case JsonPatchOperationsActionTypes.FLUSH_PATCH_OPERATIONS: {
      return flushOperation(state, action as FlushPatchOperationsAction);
    }

    default: {
      return state;
    }
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
function newPatchOperation(state: JsonPatchOperationsState, action: PatchOperationsActions): JsonPatchOperationsState {
  if (hasValue(state[action.payload.namespace])) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.assign({}, state[action.payload.namespace], {})
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
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function flushOperation(state: JsonPatchOperationsState, action: FlushPatchOperationsAction): JsonPatchOperationsState {
  if (hasValue(state[action.payload.namespace])) {
    return Object.assign({}, state, {
      [action.payload.namespace]: Object.create(null)
    });
  } else {
    return state;
  }
}

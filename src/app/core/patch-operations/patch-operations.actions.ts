import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { PatchOperationModel } from '../../core/shared/patch-request.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const JsonPatchOperationsActionTypes = {
  NEW_JSON_PATCH_ADD_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_ADD_OPERATION'),
  NEW_JSON_PATCH_COPY_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_COPY_OPERATION'),
  NEW_JSON_PATCH_MOVE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_MOVE_OPERATION'),
  NEW_JSON_PATCH_REMOVE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_REMOVE_OPERATION'),
  NEW_JSON_PATCH_REPLACE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_REPLACE_OPERATION'),
  FLUSH_PATCH_OPERATIONS: type('dspace/core/patch/FLUSH_PATCH_OPERATIONS'),
};

/* tslint:disable:max-classes-per-file */

export class NewPatchAddOperationAction implements Action {
  type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION;
  payload: {
    namespace: string;
    path: string;
    value: any
  };

  /**
   * Add new HTTP/PATCH ADD operations to state
   *
   * @param namespace
   *    the namespace where to add operation
   * @param path
   *    the path of the operation
   * @param value
   *    the operation's payload
   */
  constructor(namespace: string, path: string, value: any) {
    this.payload = { namespace, path, value };
  }
}

export class NewPatchCopyOperationAction implements Action {
  type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_COPY_OPERATION;
  payload: {
    namespace: string;
    from: string;
    path: string;
  };

  /**
   * Add new JSON Patch COPY operation to state
   *
   * @param namespace
   *    the namespace where to add operation
   * @param from
   *    the path to copy the value from
   * @param path
   *    the path where to copy the value
   */
  constructor(namespace: string, from: string, path: string) {
    this.payload = { namespace, from, path };
  }
}

export class NewPatchMoveOperationAction implements Action {
  type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_MOVE_OPERATION;
  payload: {
    namespace: string;
    from: string;
    path: string;
  };

  /**
   * Add new JSON Patch MOVE operation to state
   *
   * @param namespace
   *    the namespace where to add operation
   * @param from
   *    the path to move the value from
   * @param path
   *    the path where to move the value
   */
  constructor(namespace: string, from: string, path: string) {
    this.payload = { namespace, from, path };
  }
}

export class NewPatchRemoveOperationAction implements Action {
  type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION;
  payload: {
    namespace: string;
    path: string;
  };

  /**
   * Add new JSON Patch REMOVE operation to state
   *
   * @param namespace
   *    the namespace where to add operation
   * @param path
   *    the path of the operation
   */
  constructor(namespace: string, path: string) {
    this.payload = { namespace, path };
  }
}

export class NewPatchReplaceOperationAction implements Action {
  type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION;
  payload: {
    namespace: string;
    path: string;
    value: any
  };

  /**
   * Add new JSON Patch REPLACE operation to state
   *
   * @param namespace
   *    the namespace where to add operation
   * @param path
   *    the path of the operation
   * @param value
   *    the operation's payload
   */
  constructor(namespace: string, path: string, value: any) {
    this.payload = { namespace, path, value };
  }
}

export class FlushPatchOperationsAction implements Action {
  type = JsonPatchOperationsActionTypes.FLUSH_PATCH_OPERATIONS;
  payload: {
    namespace: string;
  };

  /**
   * Flush list of the JSON Patch operations
   *
   * @param namespace
   *    the submission's ID
   */
  constructor(namespace: string) {
    this.payload = { namespace };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type PatchOperationsActions
  = NewPatchAddOperationAction
  | NewPatchCopyOperationAction
  | NewPatchMoveOperationAction
  | NewPatchRemoveOperationAction
  | NewPatchReplaceOperationAction
  | FlushPatchOperationsAction

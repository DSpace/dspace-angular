import { type } from '../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var JsonPatchOperationsActionTypes = {
    NEW_JSON_PATCH_ADD_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_ADD_OPERATION'),
    NEW_JSON_PATCH_COPY_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_COPY_OPERATION'),
    NEW_JSON_PATCH_MOVE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_MOVE_OPERATION'),
    NEW_JSON_PATCH_REMOVE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_REMOVE_OPERATION'),
    NEW_JSON_PATCH_REPLACE_OPERATION: type('dspace/core/patch/NEW_JSON_PATCH_REPLACE_OPERATION'),
    COMMIT_JSON_PATCH_OPERATIONS: type('dspace/core/patch/COMMIT_JSON_PATCH_OPERATIONS'),
    ROLLBACK_JSON_PATCH_OPERATIONS: type('dspace/core/patch/ROLLBACK_JSON_PATCH_OPERATIONS'),
    FLUSH_JSON_PATCH_OPERATIONS: type('dspace/core/patch/FLUSH_JSON_PATCH_OPERATIONS'),
    START_TRANSACTION_JSON_PATCH_OPERATIONS: type('dspace/core/patch/START_TRANSACTION_JSON_PATCH_OPERATIONS'),
};
/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to commit the current transaction
 */
var CommitPatchOperationsAction = /** @class */ (function () {
    /**
     * Create a new CommitPatchOperationsAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     */
    function CommitPatchOperationsAction(resourceType, resourceId) {
        this.type = JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS;
        this.payload = { resourceType: resourceType, resourceId: resourceId };
    }
    return CommitPatchOperationsAction;
}());
export { CommitPatchOperationsAction };
/**
 * An ngrx action to rollback the current transaction
 */
var RollbacktPatchOperationsAction = /** @class */ (function () {
    /**
     * Create a new CommitPatchOperationsAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     */
    function RollbacktPatchOperationsAction(resourceType, resourceId) {
        this.type = JsonPatchOperationsActionTypes.ROLLBACK_JSON_PATCH_OPERATIONS;
        this.payload = { resourceType: resourceType, resourceId: resourceId };
    }
    return RollbacktPatchOperationsAction;
}());
export { RollbacktPatchOperationsAction };
/**
 * An ngrx action to initiate a transaction block
 */
var StartTransactionPatchOperationsAction = /** @class */ (function () {
    /**
     * Create a new CommitPatchOperationsAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     * @param startTime
     *    the start timestamp
     */
    function StartTransactionPatchOperationsAction(resourceType, resourceId, startTime) {
        this.type = JsonPatchOperationsActionTypes.START_TRANSACTION_JSON_PATCH_OPERATIONS;
        this.payload = { resourceType: resourceType, resourceId: resourceId, startTime: startTime };
    }
    return StartTransactionPatchOperationsAction;
}());
export { StartTransactionPatchOperationsAction };
/**
 * An ngrx action to flush list of the JSON Patch operations
 */
var FlushPatchOperationsAction = /** @class */ (function () {
    /**
     * Create a new FlushPatchOperationsAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     */
    function FlushPatchOperationsAction(resourceType, resourceId) {
        this.type = JsonPatchOperationsActionTypes.FLUSH_JSON_PATCH_OPERATIONS;
        this.payload = { resourceType: resourceType, resourceId: resourceId };
    }
    return FlushPatchOperationsAction;
}());
export { FlushPatchOperationsAction };
/**
 * An ngrx action to Add new HTTP/PATCH ADD operations to state
 */
var NewPatchAddOperationAction = /** @class */ (function () {
    /**
     * Create a new NewPatchAddOperationAction
     *
     * @param resourceType
     *    the resource's type where to add operation
     * @param resourceId
     *    the resource's ID
     * @param path
     *    the path of the operation
     * @param value
     *    the operation's payload
     */
    function NewPatchAddOperationAction(resourceType, resourceId, path, value) {
        this.type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_ADD_OPERATION;
        this.payload = { resourceType: resourceType, resourceId: resourceId, path: path, value: value };
    }
    return NewPatchAddOperationAction;
}());
export { NewPatchAddOperationAction };
/**
 * An ngrx action to add new JSON Patch COPY operation to state
 */
var NewPatchCopyOperationAction = /** @class */ (function () {
    /**
     * Create a new NewPatchCopyOperationAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     * @param from
     *    the path to copy the value from
     * @param path
     *    the path where to copy the value
     */
    function NewPatchCopyOperationAction(resourceType, resourceId, from, path) {
        this.type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_COPY_OPERATION;
        this.payload = { resourceType: resourceType, resourceId: resourceId, from: from, path: path };
    }
    return NewPatchCopyOperationAction;
}());
export { NewPatchCopyOperationAction };
/**
 * An ngrx action to Add new JSON Patch MOVE operation to state
 */
var NewPatchMoveOperationAction = /** @class */ (function () {
    /**
     * Create a new NewPatchMoveOperationAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     * @param from
     *    the path to move the value from
     * @param path
     *    the path where to move the value
     */
    function NewPatchMoveOperationAction(resourceType, resourceId, from, path) {
        this.type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_MOVE_OPERATION;
        this.payload = { resourceType: resourceType, resourceId: resourceId, from: from, path: path };
    }
    return NewPatchMoveOperationAction;
}());
export { NewPatchMoveOperationAction };
/**
 * An ngrx action to Add new JSON Patch REMOVE operation to state
 */
var NewPatchRemoveOperationAction = /** @class */ (function () {
    /**
     * Create a new NewPatchRemoveOperationAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     * @param path
     *    the path of the operation
     */
    function NewPatchRemoveOperationAction(resourceType, resourceId, path) {
        this.type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REMOVE_OPERATION;
        this.payload = { resourceType: resourceType, resourceId: resourceId, path: path };
    }
    return NewPatchRemoveOperationAction;
}());
export { NewPatchRemoveOperationAction };
/**
 * An ngrx action to add new JSON Patch REPLACE operation to state
 */
var NewPatchReplaceOperationAction = /** @class */ (function () {
    /**
     * Create a new NewPatchReplaceOperationAction
     *
     * @param resourceType
     *    the resource's type
     * @param resourceId
     *    the resource's ID
     * @param path
     *    the path of the operation
     * @param value
     *    the operation's payload
     */
    function NewPatchReplaceOperationAction(resourceType, resourceId, path, value) {
        this.type = JsonPatchOperationsActionTypes.NEW_JSON_PATCH_REPLACE_OPERATION;
        this.payload = { resourceType: resourceType, resourceId: resourceId, path: path, value: value };
    }
    return NewPatchReplaceOperationAction;
}());
export { NewPatchReplaceOperationAction };
//# sourceMappingURL=json-patch-operations.actions.js.map
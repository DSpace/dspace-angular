import { type } from '../../shared/ngrx/type';
/**
 * The list of ServerSyncBufferAction type definitions
 */
export var ServerSyncBufferActionTypes = {
    ADD: type('dspace/core/cache/syncbuffer/ADD'),
    COMMIT: type('dspace/core/cache/syncbuffer/COMMIT'),
    EMPTY: type('dspace/core/cache/syncbuffer/EMPTY'),
};
/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add a new cached object to the server sync buffer
 */
var AddToSSBAction = /** @class */ (function () {
    /**
     * Create a new AddToSSBAction
     *
     * @param href
     *    the unique href of the cached object entry that should be updated
     */
    function AddToSSBAction(href, method) {
        this.type = ServerSyncBufferActionTypes.ADD;
        this.payload = { href: href, method: method };
    }
    return AddToSSBAction;
}());
export { AddToSSBAction };
/**
 * An ngrx action to commit everything (for a certain method, when specified) in the ServerSyncBuffer to the server
 */
var CommitSSBAction = /** @class */ (function () {
    /**
     * Create a new CommitSSBAction
     *
     * @param method
     *    an optional method for which the ServerSyncBuffer should send its entries to the server
     */
    function CommitSSBAction(method) {
        this.type = ServerSyncBufferActionTypes.COMMIT;
        this.payload = method;
    }
    return CommitSSBAction;
}());
export { CommitSSBAction };
/**
 * An ngrx action to remove everything (for a certain method, when specified) from the ServerSyncBuffer to the server
 */
var EmptySSBAction = /** @class */ (function () {
    /**
     * Create a new EmptySSBAction
     *
     * @param method
     *    an optional method for which the ServerSyncBuffer should remove its entries
     *    if this parameter is omitted, the buffer will be emptied as a whole
     */
    function EmptySSBAction(method) {
        this.type = ServerSyncBufferActionTypes.EMPTY;
        this.payload = method;
    }
    return EmptySSBAction;
}());
export { EmptySSBAction };
//# sourceMappingURL=server-sync-buffer.actions.js.map
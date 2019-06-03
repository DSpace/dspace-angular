import { type } from '../../shared/ngrx/type';
/**
 * The list of RequestAction type definitions
 */
export var RequestActionTypes = {
    CONFIGURE: type('dspace/core/data/request/CONFIGURE'),
    EXECUTE: type('dspace/core/data/request/EXECUTE'),
    COMPLETE: type('dspace/core/data/request/COMPLETE'),
    RESET_TIMESTAMPS: type('dspace/core/data/request/RESET_TIMESTAMPS'),
    REMOVE: type('dspace/core/data/request/REMOVE')
};
/* tslint:disable:max-classes-per-file */
var RequestConfigureAction = /** @class */ (function () {
    function RequestConfigureAction(request) {
        this.type = RequestActionTypes.CONFIGURE;
        this.payload = request;
    }
    return RequestConfigureAction;
}());
export { RequestConfigureAction };
var RequestExecuteAction = /** @class */ (function () {
    /**
     * Create a new RequestExecuteAction
     *
     * @param uuid
     *    the request's uuid
     */
    function RequestExecuteAction(uuid) {
        this.type = RequestActionTypes.EXECUTE;
        this.payload = uuid;
    }
    return RequestExecuteAction;
}());
export { RequestExecuteAction };
/**
 * An ngrx action to indicate a response was returned
 */
var RequestCompleteAction = /** @class */ (function () {
    /**
     * Create a new RequestCompleteAction
     *
     * @param uuid
     *    the request's uuid
     */
    function RequestCompleteAction(uuid, response) {
        this.type = RequestActionTypes.COMPLETE;
        this.payload = {
            uuid: uuid,
            response: response
        };
    }
    return RequestCompleteAction;
}());
export { RequestCompleteAction };
/**
 * An ngrx action to reset the timeAdded property of all responses in the cached objects
 */
var ResetResponseTimestampsAction = /** @class */ (function () {
    /**
     * Create a new ResetResponseTimestampsAction
     *
     * @param newTimestamp
     *    the new timeAdded all objects should get
     */
    function ResetResponseTimestampsAction(newTimestamp) {
        this.type = RequestActionTypes.RESET_TIMESTAMPS;
        this.payload = newTimestamp;
    }
    return ResetResponseTimestampsAction;
}());
export { ResetResponseTimestampsAction };
/**
 * An ngrx action to remove a cached request
 */
var RequestRemoveAction = /** @class */ (function () {
    /**
     * Create a new RequestRemoveAction
     *
     * @param uuid
     *    the request's uuid
     */
    function RequestRemoveAction(uuid) {
        this.type = RequestActionTypes.REMOVE;
        this.uuid = uuid;
    }
    return RequestRemoveAction;
}());
export { RequestRemoveAction };
//# sourceMappingURL=request.actions.js.map
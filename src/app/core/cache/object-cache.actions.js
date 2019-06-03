import { type } from '../../shared/ngrx/type';
/**
 * The list of ObjectCacheAction type definitions
 */
export var ObjectCacheActionTypes = {
    ADD: type('dspace/core/cache/object/ADD'),
    REMOVE: type('dspace/core/cache/object/REMOVE'),
    RESET_TIMESTAMPS: type('dspace/core/cache/object/RESET_TIMESTAMPS'),
    ADD_PATCH: type('dspace/core/cache/object/ADD_PATCH'),
    APPLY_PATCH: type('dspace/core/cache/object/APPLY_PATCH')
};
/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add an object to the cache
 */
var AddToObjectCacheAction = /** @class */ (function () {
    /**
     * Create a new AddToObjectCacheAction
     *
     * @param objectToCache
     *    the object to add
     * @param timeAdded
     *    the time it was added
     * @param msToLive
     *    the amount of milliseconds before it should expire
     * @param requestHref
     *    The href of the request that resulted in this object
     *    This isn't necessarily the same as the object's self
     *    link, it could have been part of a list for example
     */
    function AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestUUID) {
        this.type = ObjectCacheActionTypes.ADD;
        this.payload = { objectToCache: objectToCache, timeAdded: timeAdded, msToLive: msToLive, requestUUID: requestUUID };
    }
    return AddToObjectCacheAction;
}());
export { AddToObjectCacheAction };
/**
 * An ngrx action to remove an object from the cache
 */
var RemoveFromObjectCacheAction = /** @class */ (function () {
    /**
     * Create a new RemoveFromObjectCacheAction
     *
     * @param href
     *    the unique href of the object to remove
     */
    function RemoveFromObjectCacheAction(href) {
        this.type = ObjectCacheActionTypes.REMOVE;
        this.payload = href;
    }
    return RemoveFromObjectCacheAction;
}());
export { RemoveFromObjectCacheAction };
/**
 * An ngrx action to reset the timeAdded property of all cached objects
 */
var ResetObjectCacheTimestampsAction = /** @class */ (function () {
    /**
     * Create a new ResetObjectCacheTimestampsAction
     *
     * @param newTimestamp
     *    the new timeAdded all objects should get
     */
    function ResetObjectCacheTimestampsAction(newTimestamp) {
        this.type = ObjectCacheActionTypes.RESET_TIMESTAMPS;
        this.payload = newTimestamp;
    }
    return ResetObjectCacheTimestampsAction;
}());
export { ResetObjectCacheTimestampsAction };
/**
 * An ngrx action to add new operations to a specified cached object
 */
var AddPatchObjectCacheAction = /** @class */ (function () {
    /**
     * Create a new AddPatchObjectCacheAction
     *
     * @param href
     *    the unique href of the object that should be updated
     * @param operations
     *    the list of operations to add
     */
    function AddPatchObjectCacheAction(href, operations) {
        this.type = ObjectCacheActionTypes.ADD_PATCH;
        this.payload = { href: href, operations: operations };
    }
    return AddPatchObjectCacheAction;
}());
export { AddPatchObjectCacheAction };
/**
 * An ngrx action to apply all existing operations to a specified cached object
 */
var ApplyPatchObjectCacheAction = /** @class */ (function () {
    /**
     * Create a new ApplyPatchObjectCacheAction
     *
     * @param href
     *    the unique href of the object that should be updated
     */
    function ApplyPatchObjectCacheAction(href) {
        this.type = ObjectCacheActionTypes.APPLY_PATCH;
        this.payload = href;
    }
    return ApplyPatchObjectCacheAction;
}());
export { ApplyPatchObjectCacheAction };
//# sourceMappingURL=object-cache.actions.js.map
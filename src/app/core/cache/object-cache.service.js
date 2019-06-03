import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { applyPatch } from 'fast-json-patch';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, take, } from 'rxjs/operators';
import { hasNoValue, isNotEmpty } from '../../shared/empty.util';
import { coreSelector } from '../core.selectors';
import { RestRequestMethod } from '../data/rest-request-method';
import { selfLinkFromUuidSelector } from '../index/index.selectors';
import { NormalizedObjectFactory } from './models/normalized-object-factory';
import { AddPatchObjectCacheAction, AddToObjectCacheAction, ApplyPatchObjectCacheAction, RemoveFromObjectCacheAction } from './object-cache.actions';
import { AddToSSBAction } from './server-sync-buffer.actions';
/**
 * The base selector function to select the object cache in the store
 */
var objectCacheSelector = createSelector(coreSelector, function (state) { return state['cache/object']; });
/**
 * Selector function to select an object entry by self link from the cache
 * @param selfLink The self link of the object
 */
var entryFromSelfLinkSelector = function (selfLink) { return createSelector(objectCacheSelector, function (state) { return state[selfLink]; }); };
/**
 * A service to interact with the object cache
 */
var ObjectCacheService = /** @class */ (function () {
    function ObjectCacheService(store) {
        this.store = store;
    }
    /**
     * Add an object to the cache
     *
     * @param objectToCache
     *    The object to add
     * @param msToLive
     *    The number of milliseconds it should be cached for
     * @param requestUUID
     *    The UUID of the request that resulted in this object
     */
    ObjectCacheService.prototype.add = function (objectToCache, msToLive, requestUUID) {
        this.store.dispatch(new AddToObjectCacheAction(objectToCache, new Date().getTime(), msToLive, requestUUID));
    };
    /**
     * Remove the object with the supplied href from the cache
     *
     * @param href
     *    The unique href of the object to be removed
     */
    ObjectCacheService.prototype.remove = function (uuid) {
        this.store.dispatch(new RemoveFromObjectCacheAction(uuid));
    };
    /**
     * Get an observable of the object with the specified UUID
     *
     * @param uuid
     *    The UUID of the object to get
     * @return Observable<NormalizedObject<T>>
     *    An observable of the requested object in normalized form
     */
    ObjectCacheService.prototype.getObjectByUUID = function (uuid) {
        var _this = this;
        return this.store.pipe(select(selfLinkFromUuidSelector(uuid)), mergeMap(function (selfLink) { return _this.getObjectBySelfLink(selfLink); }));
    };
    /**
     * Get an observable of the object with the specified selfLink
     *
     * @param selfLink
     *    The selfLink of the object to get
     * @return Observable<NormalizedObject<T>>
     *    An observable of the requested object in normalized form
     */
    ObjectCacheService.prototype.getObjectBySelfLink = function (selfLink) {
        return this.getBySelfLink(selfLink).pipe(map(function (entry) {
            if (isNotEmpty(entry.patches)) {
                var flatPatch = [].concat.apply([], entry.patches.map(function (patch) { return patch.operations; }));
                var patchedData = applyPatch(entry.data, flatPatch, undefined, false).newDocument;
                return Object.assign({}, entry, { data: patchedData });
            }
            else {
                return entry;
            }
        }), map(function (entry) {
            var type = NormalizedObjectFactory.getConstructor(entry.data.type);
            return Object.assign(new type(), entry.data);
        }));
    };
    /**
     * Get an observable of the object cache entry with the specified selfLink
     *
     * @param selfLink
     *    The selfLink of the object to get
     * @return Observable<ObjectCacheEntry>
     *    An observable of the requested object cache entry
     */
    ObjectCacheService.prototype.getBySelfLink = function (selfLink) {
        var _this = this;
        return this.store.pipe(select(entryFromSelfLinkSelector(selfLink)), filter(function (entry) { return _this.isValid(entry); }), distinctUntilChanged());
    };
    /**
     * Get an observable of the request's uuid with the specified selfLink
     *
     * @param selfLink
     *    The selfLink of the object to get
     * @return Observable<string>
     *    An observable of the request's uuid
     */
    ObjectCacheService.prototype.getRequestUUIDBySelfLink = function (selfLink) {
        return this.getBySelfLink(selfLink).pipe(map(function (entry) { return entry.requestUUID; }), distinctUntilChanged());
    };
    /**
     * Get an observable of the request's uuid with the specified uuid
     *
     * @param uuid
     *    The uuid of the object to get
     * @return Observable<string>
     *    An observable of the request's uuid
     */
    ObjectCacheService.prototype.getRequestUUIDByObjectUUID = function (uuid) {
        var _this = this;
        return this.store.pipe(select(selfLinkFromUuidSelector(uuid)), mergeMap(function (selfLink) { return _this.getRequestUUIDBySelfLink(selfLink); }));
    };
    /**
     * Get an observable for an array of objects of the same type
     * with the specified self links
     *
     * The type needs to be specified as well, in order to turn
     * the cached plain javascript object in to an instance of
     * a class.
     *
     * e.g. getList([
     *        'http://localhost:8080/api/core/collections/c96588c6-72d3-425d-9d47-fa896255a695',
     *        'http://localhost:8080/api/core/collections/cff860da-cf5f-4fda-b8c9-afb7ec0b2d9e'
     *      ], Collection)
     *
     * @param selfLinks
     *    An array of self links of the objects to get
     * @param type
     *    The type of the objects to get
     * @return Observable<Array<T>>
     */
    ObjectCacheService.prototype.getList = function (selfLinks) {
        var _this = this;
        return observableCombineLatest(selfLinks.map(function (selfLink) { return _this.getObjectBySelfLink(selfLink); }));
    };
    /**
     * Check whether the object with the specified UUID is cached
     *
     * @param uuid
     *    The UUID of the object to check
     * @return boolean
     *    true if the object with the specified UUID is cached,
     *    false otherwise
     */
    ObjectCacheService.prototype.hasByUUID = function (uuid) {
        var _this = this;
        var result;
        this.store.pipe(select(selfLinkFromUuidSelector(uuid)), take(1)).subscribe(function (selfLink) { return result = _this.hasBySelfLink(selfLink); });
        return result;
    };
    /**
     * Check whether the object with the specified self link is cached
     *
     * @param selfLink
     *    The self link of the object to check
     * @return boolean
     *    true if the object with the specified self link is cached,
     *    false otherwise
     */
    ObjectCacheService.prototype.hasBySelfLink = function (selfLink) {
        var _this = this;
        var result = false;
        this.store.pipe(select(entryFromSelfLinkSelector(selfLink)), take(1)).subscribe(function (entry) { return result = _this.isValid(entry); });
        return result;
    };
    /**
     * Check whether an ObjectCacheEntry should still be cached
     *
     * @param entry
     *    the entry to check
     * @return boolean
     *    false if the entry is null, undefined, or its time to
     *    live has been exceeded, true otherwise
     */
    ObjectCacheService.prototype.isValid = function (entry) {
        if (hasNoValue(entry)) {
            return false;
        }
        else {
            var timeOutdated = entry.timeAdded + entry.msToLive;
            var isOutDated = new Date().getTime() > timeOutdated;
            if (isOutDated) {
                this.store.dispatch(new RemoveFromObjectCacheAction(entry.data.self));
            }
            return !isOutDated;
        }
    };
    /**
     * Add operations to the existing list of operations for an ObjectCacheEntry
     * Makes sure the ServerSyncBuffer for this ObjectCacheEntry is updated
     * @param {string} uuid
     *     the uuid of the ObjectCacheEntry
     * @param {Operation[]} patch
     *     list of operations to perform
     */
    ObjectCacheService.prototype.addPatch = function (selfLink, patch) {
        this.store.dispatch(new AddPatchObjectCacheAction(selfLink, patch));
        this.store.dispatch(new AddToSSBAction(selfLink, RestRequestMethod.PATCH));
    };
    /**
     * Check whether there are any unperformed operations for an ObjectCacheEntry
     *
     * @param entry
     *    the entry to check
     * @return boolean
     *    false if the entry is there are no operations left in the ObjectCacheEntry, true otherwise
     */
    ObjectCacheService.prototype.isDirty = function (entry) {
        return isNotEmpty(entry.patches);
    };
    /**
     * Apply the existing operations on an ObjectCacheEntry in the store
     * NB: this does not make any server side changes
     * @param {string} uuid
     *     the uuid of the ObjectCacheEntry
     */
    ObjectCacheService.prototype.applyPatchesToCachedObject = function (selfLink) {
        this.store.dispatch(new ApplyPatchObjectCacheAction(selfLink));
    };
    ObjectCacheService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], ObjectCacheService);
    return ObjectCacheService;
}());
export { ObjectCacheService };
//# sourceMappingURL=object-cache.service.js.map
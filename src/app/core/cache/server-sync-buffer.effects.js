import * as tslib_1 from "tslib";
import { delay, exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { coreSelector } from '../core.selectors';
import { CommitSSBAction, EmptySSBAction, ServerSyncBufferActionTypes } from './server-sync-buffer.actions';
import { GLOBAL_CONFIG } from '../../../config';
import { createSelector, select, Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { RequestService } from '../data/request.service';
import { PutRequest } from '../data/request.models';
import { ObjectCacheService } from './object-cache.service';
import { ApplyPatchObjectCacheAction } from './object-cache.actions';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { RestRequestMethod } from '../data/rest-request-method';
var ServerSyncBufferEffects = /** @class */ (function () {
    function ServerSyncBufferEffects(actions$, store, requestService, objectCache, EnvConfig) {
        var _this = this;
        this.actions$ = actions$;
        this.store = store;
        this.requestService = requestService;
        this.objectCache = objectCache;
        this.EnvConfig = EnvConfig;
        /**
         * When an ADDToSSBAction is dispatched
         * Set a time out (configurable per method type)
         * Then dispatch a CommitSSBAction
         * When the delay is running, no new AddToSSBActions are processed in this effect
         */
        this.setTimeoutForServerSync = this.actions$
            .pipe(ofType(ServerSyncBufferActionTypes.ADD), exhaustMap(function (action) {
            var autoSyncConfig = _this.EnvConfig.cache.autoSync;
            var timeoutInSeconds = autoSyncConfig.timePerMethod[action.payload.method] || autoSyncConfig.defaultTime;
            return observableOf(new CommitSSBAction(action.payload.method)).pipe(delay(timeoutInSeconds * 1000));
        }));
        /**
         * When a CommitSSBAction is dispatched
         * Create a list of actions for each entry in the current buffer state to be dispatched
         * When the list of actions is not empty, also dispatch an EmptySSBAction
         * When the list is empty dispatch a NO_ACTION placeholder action
         */
        this.commitServerSyncBuffer = this.actions$
            .pipe(ofType(ServerSyncBufferActionTypes.COMMIT), switchMap(function (action) {
            return _this.store.pipe(select(serverSyncBufferSelector()), take(1), /* necessary, otherwise delay will not have any effect after the first run */ switchMap(function (bufferState) {
                var actions = bufferState.buffer
                    .filter(function (entry) {
                    /* If there's a request method, filter
                     If there's no filter, commit everything */
                    if (hasValue(action.payload)) {
                        return entry.method === action.payload;
                    }
                    return true;
                })
                    .map(function (entry) {
                    if (entry.method === RestRequestMethod.PATCH) {
                        return _this.applyPatch(entry.href);
                    }
                    else {
                        /* TODO implement for other request method types */
                    }
                });
                /* Add extra action to array, to make sure the ServerSyncBuffer is emptied afterwards */
                if (isNotEmpty(actions) && isNotUndefined(actions[0])) {
                    return observableCombineLatest.apply(void 0, actions).pipe(switchMap(function (array) { return array.concat([new EmptySSBAction(action.payload)]); }));
                }
                else {
                    return observableOf({ type: 'NO_ACTION' });
                }
            }));
        }));
    }
    /**
     * private method to create an ApplyPatchObjectCacheAction based on a cache entry
     * and to do the actual patch request to the server
     * @param {string} href The self link of the cache entry
     * @returns {Observable<Action>} ApplyPatchObjectCacheAction to be dispatched
     */
    ServerSyncBufferEffects.prototype.applyPatch = function (href) {
        var _this = this;
        var patchObject = this.objectCache.getObjectBySelfLink(href).pipe(take(1));
        return patchObject.pipe(map(function (object) {
            var serializedObject = new DSpaceRESTv2Serializer(object.constructor).serialize(object);
            _this.requestService.configure(new PutRequest(_this.requestService.generateRequestId(), href, serializedObject));
            return new ApplyPatchObjectCacheAction(href);
        }));
    };
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], ServerSyncBufferEffects.prototype, "setTimeoutForServerSync", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], ServerSyncBufferEffects.prototype, "commitServerSyncBuffer", void 0);
    ServerSyncBufferEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(4, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Actions,
            Store,
            RequestService,
            ObjectCacheService, Object])
    ], ServerSyncBufferEffects);
    return ServerSyncBufferEffects;
}());
export { ServerSyncBufferEffects };
export function serverSyncBufferSelector() {
    return createSelector(coreSelector, function (state) { return state['cache/syncbuffer']; });
}
//# sourceMappingURL=server-sync-buffer.effects.js.map
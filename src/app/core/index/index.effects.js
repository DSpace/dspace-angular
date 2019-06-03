import * as tslib_1 from "tslib";
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ObjectCacheActionTypes } from '../cache/object-cache.actions';
import { RequestActionTypes } from '../data/request.actions';
import { AddToIndexAction, RemoveFromIndexByValueAction } from './index.actions';
import { hasValue } from '../../shared/empty.util';
import { IndexName } from './index.reducer';
import { RestRequestMethod } from '../data/rest-request-method';
var UUIDIndexEffects = /** @class */ (function () {
    function UUIDIndexEffects(actions$) {
        this.actions$ = actions$;
        this.addObject$ = this.actions$
            .pipe(ofType(ObjectCacheActionTypes.ADD), filter(function (action) { return hasValue(action.payload.objectToCache.uuid); }), map(function (action) {
            return new AddToIndexAction(IndexName.OBJECT, action.payload.objectToCache.uuid, action.payload.objectToCache.self);
        }));
        this.removeObject$ = this.actions$
            .pipe(ofType(ObjectCacheActionTypes.REMOVE), map(function (action) {
            return new RemoveFromIndexByValueAction(IndexName.OBJECT, action.payload);
        }));
        this.addRequest$ = this.actions$
            .pipe(ofType(RequestActionTypes.CONFIGURE), filter(function (action) { return action.payload.method === RestRequestMethod.GET; }), map(function (action) {
            return new AddToIndexAction(IndexName.REQUEST, action.payload.href, action.payload.uuid);
        }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], UUIDIndexEffects.prototype, "addObject$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], UUIDIndexEffects.prototype, "removeObject$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], UUIDIndexEffects.prototype, "addRequest$", void 0);
    UUIDIndexEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions])
    ], UUIDIndexEffects);
    return UUIDIndexEffects;
}());
export { UUIDIndexEffects };
//# sourceMappingURL=index.effects.js.map
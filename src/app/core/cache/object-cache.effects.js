import * as tslib_1 from "tslib";
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StoreActionTypes } from '../../store.actions';
import { ResetObjectCacheTimestampsAction } from './object-cache.actions';
var ObjectCacheEffects = /** @class */ (function () {
    function ObjectCacheEffects(actions$) {
        this.actions$ = actions$;
        /**
         * When the store is rehydrated in the browser, set all cache
         * timestamps to 'now', because the time zone of the server can
         * differ from the client.
         *
         * This assumes that the server cached everything a negligible
         * time ago, and will likely need to be revisited later
         */
        this.fixTimestampsOnRehydrate = this.actions$
            .pipe(ofType(StoreActionTypes.REHYDRATE), map(function () { return new ResetObjectCacheTimestampsAction(new Date().getTime()); }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectCacheEffects.prototype, "fixTimestampsOnRehydrate", void 0);
    ObjectCacheEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions])
    ], ObjectCacheEffects);
    return ObjectCacheEffects;
}());
export { ObjectCacheEffects };
//# sourceMappingURL=object-cache.effects.js.map
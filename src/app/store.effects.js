import * as tslib_1 from "tslib";
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StoreActionTypes } from './store.actions';
import { HostWindowResizeAction } from './shared/host-window.actions';
var StoreEffects = /** @class */ (function () {
    function StoreEffects(actions, store) {
        this.actions = actions;
        this.store = store;
        this.replay = this.actions.pipe(ofType(StoreActionTypes.REPLAY), map(function (replayAction) {
            // TODO: should be able to replay all actions before the browser attempts to
            // replayAction.payload.forEach((action: Action) => {
            //   this.store.dispatch(action);
            // });
            return observableOf({});
        }));
        this.resize = this.actions.pipe(ofType(StoreActionTypes.REPLAY, StoreActionTypes.REHYDRATE), map(function () { return new HostWindowResizeAction(window.innerWidth, window.innerHeight); }));
    }
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], StoreEffects.prototype, "replay", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], StoreEffects.prototype, "resize", void 0);
    StoreEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions, Store])
    ], StoreEffects);
    return StoreEffects;
}());
export { StoreEffects };
//# sourceMappingURL=store.effects.js.map
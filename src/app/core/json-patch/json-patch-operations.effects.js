import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { FlushPatchOperationsAction, JsonPatchOperationsActionTypes } from './json-patch-operations.actions';
/**
 * Provides effect methods for jsonPatch Operations actions
 */
var JsonPatchOperationsEffects = /** @class */ (function () {
    function JsonPatchOperationsEffects(actions$) {
        this.actions$ = actions$;
        /**
         * Dispatches a FlushPatchOperationsAction for every dispatched CommitPatchOperationsAction
         */
        this.commit$ = this.actions$.pipe(ofType(JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS), map(function (action) {
            return new FlushPatchOperationsAction(action.payload.resourceType, action.payload.resourceId);
        }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], JsonPatchOperationsEffects.prototype, "commit$", void 0);
    JsonPatchOperationsEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions])
    ], JsonPatchOperationsEffects);
    return JsonPatchOperationsEffects;
}());
export { JsonPatchOperationsEffects };
//# sourceMappingURL=json-patch-operations.effects.js.map
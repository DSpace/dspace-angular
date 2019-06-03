import * as tslib_1 from "tslib";
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { TruncatableExpandAction, TruncatableToggleAction, TruncatableCollapseAction } from './truncatable.actions';
import { hasValue } from '../empty.util';
var truncatableStateSelector = function (state) { return state.truncatable; };
/**
 * Service responsible for truncating/clamping text and performing actions on truncatable elements
 */
var TruncatableService = /** @class */ (function () {
    function TruncatableService(store) {
        this.store = store;
    }
    /**
     * Checks if a trunctable component should currently be collapsed
     * @param {string} id The UUID of the truncatable component
     * @returns {Observable<boolean>} Emits true if the state in the store is currently collapsed for the given truncatable component
     */
    TruncatableService.prototype.isCollapsed = function (id) {
        return this.store.pipe(select(truncatableByIdSelector(id)), map(function (object) {
            if (object) {
                return object.collapsed;
            }
            else {
                return false;
            }
        }));
    };
    /**
     * Dispatches a toggle action to the store for a given truncatable component
     * @param {string} id The identifier of the truncatable for which the action is dispatched
     */
    TruncatableService.prototype.toggle = function (id) {
        this.store.dispatch(new TruncatableToggleAction(id));
    };
    /**
     * Dispatches a collapse action to the store for a given truncatable component
     * @param {string} id The identifier of the truncatable for which the action is dispatched
     */
    TruncatableService.prototype.collapse = function (id) {
        this.store.dispatch(new TruncatableCollapseAction(id));
    };
    /**
     * Dispatches an expand action to the store for a given truncatable component
     * @param {string} id The identifier of the truncatable for which the action is dispatched
     */
    TruncatableService.prototype.expand = function (id) {
        this.store.dispatch(new TruncatableExpandAction(id));
    };
    TruncatableService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], TruncatableService);
    return TruncatableService;
}());
export { TruncatableService };
function truncatableByIdSelector(id) {
    return keySelector(id);
}
export function keySelector(key) {
    return createSelector(truncatableStateSelector, function (state) {
        if (hasValue(state)) {
            return state[key];
        }
        else {
            return undefined;
        }
    });
}
//# sourceMappingURL=truncatable.service.js.map
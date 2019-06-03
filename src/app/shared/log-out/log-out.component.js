import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LogOutAction } from '../../core/auth/auth.actions';
import { getLogOutError, } from '../../core/auth/selectors';
import { fadeOut } from '../animations/fade';
var LogOutComponent = /** @class */ (function () {
    /**
     * @constructor
     * @param {Store<State>} store
     * @param {Router} router
     */
    function LogOutComponent(router, store) {
        this.router = router;
        this.store = store;
    }
    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     */
    LogOutComponent.prototype.ngOnInit = function () {
        // set error
        this.error = this.store.pipe(select(getLogOutError));
    };
    /**
     * Go to the home page.
     */
    LogOutComponent.prototype.home = function () {
        this.router.navigate(['/home']);
    };
    LogOutComponent.prototype.logOut = function () {
        this.store.dispatch(new LogOutAction());
    };
    LogOutComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-log-out',
            templateUrl: './log-out.component.html',
            styleUrls: ['./log-out.component.scss'],
            animations: [fadeOut]
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            Store])
    ], LogOutComponent);
    return LogOutComponent;
}());
export { LogOutComponent };
//# sourceMappingURL=log-out.component.js.map
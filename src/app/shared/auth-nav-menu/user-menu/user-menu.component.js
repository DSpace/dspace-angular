import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getAuthenticatedUser, isAuthenticationLoading } from '../../../core/auth/selectors';
import { MYDSPACE_ROUTE } from '../../../+my-dspace-page/my-dspace-page.component';
/**
 * This component represents the user nav menu.
 */
var UserMenuComponent = /** @class */ (function () {
    function UserMenuComponent(store) {
        this.store = store;
        /**
         * The mydspace page route.
         * @type {string}
         */
        this.mydspaceRoute = MYDSPACE_ROUTE;
    }
    /**
     * Initialize all instance variables
     */
    UserMenuComponent.prototype.ngOnInit = function () {
        // set loading
        this.loading$ = this.store.pipe(select(isAuthenticationLoading));
        // set user
        this.user$ = this.store.pipe(select(getAuthenticatedUser));
    };
    UserMenuComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-user-menu',
            templateUrl: './user-menu.component.html',
            styleUrls: ['./user-menu.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], UserMenuComponent);
    return UserMenuComponent;
}());
export { UserMenuComponent };
//# sourceMappingURL=user-menu.component.js.map
import * as tslib_1 from "tslib";
import { of as observableOf } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { routerStateSelector } from '../../app.reducer';
import { isNotUndefined } from '../empty.util';
import { getAuthenticatedUser, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { LOGIN_ROUTE, LOGOUT_ROUTE } from '../../core/auth/auth.service';
var AuthNavMenuComponent = /** @class */ (function () {
    function AuthNavMenuComponent(store, windowService) {
        this.store = store;
        this.windowService = windowService;
        this.showAuth = observableOf(false);
        this.isXsOrSm$ = this.windowService.isXsOrSm();
    }
    AuthNavMenuComponent.prototype.ngOnInit = function () {
        // set isAuthenticated
        this.isAuthenticated = this.store.pipe(select(isAuthenticated));
        // set loading
        this.loading = this.store.pipe(select(isAuthenticationLoading));
        this.user = this.store.pipe(select(getAuthenticatedUser));
        this.showAuth = this.store.pipe(select(routerStateSelector), filter(function (router) { return isNotUndefined(router) && isNotUndefined(router.state); }), map(function (router) { return (!router.state.url.startsWith(LOGIN_ROUTE)
            && !router.state.url.startsWith(LOGOUT_ROUTE)); }));
    };
    AuthNavMenuComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-auth-nav-menu',
            templateUrl: './auth-nav-menu.component.html',
            styleUrls: ['./auth-nav-menu.component.scss'],
            animations: [fadeInOut, fadeOut]
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            HostWindowService])
    ], AuthNavMenuComponent);
    return AuthNavMenuComponent;
}());
export { AuthNavMenuComponent };
//# sourceMappingURL=auth-nav-menu.component.js.map
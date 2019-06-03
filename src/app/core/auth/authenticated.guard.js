import * as tslib_1 from "tslib";
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { isAuthenticated } from './selectors';
import { AuthService } from './auth.service';
import { RedirectWhenAuthenticationIsRequiredAction } from './auth.actions';
/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
var AuthenticatedGuard = /** @class */ (function () {
    /**
     * @constructor
     */
    function AuthenticatedGuard(authService, router, store) {
        this.authService = authService;
        this.router = router;
        this.store = store;
    }
    /**
     * True when user is authenticated
     * @method canActivate
     */
    AuthenticatedGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.handleAuth(url);
    };
    /**
     * True when user is authenticated
     * @method canActivateChild
     */
    AuthenticatedGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    /**
     * True when user is authenticated
     * @method canLoad
     */
    AuthenticatedGuard.prototype.canLoad = function (route) {
        var url = "/" + route.path;
        return this.handleAuth(url);
    };
    AuthenticatedGuard.prototype.handleAuth = function (url) {
        var _this = this;
        // get observable
        var observable = this.store.pipe(select(isAuthenticated));
        // redirect to sign in page if user is not authenticated
        observable.pipe(
        // .filter(() => isEmpty(this.router.routerState.snapshot.url) || this.router.routerState.snapshot.url === url)
        take(1))
            .subscribe(function (authenticated) {
            if (!authenticated) {
                _this.authService.setRedirectUrl(url);
                _this.store.dispatch(new RedirectWhenAuthenticationIsRequiredAction('Login required'));
            }
        });
        return observable;
    };
    AuthenticatedGuard = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [AuthService, Router, Store])
    ], AuthenticatedGuard);
    return AuthenticatedGuard;
}());
export { AuthenticatedGuard };
//# sourceMappingURL=authenticated.guard.js.map
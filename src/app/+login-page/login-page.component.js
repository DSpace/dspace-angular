import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AddAuthenticationMessageAction, AuthenticatedAction, AuthenticationSuccessAction, ResetAuthenticationMessagesAction } from '../core/auth/auth.actions';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { isAuthenticated } from '../core/auth/selectors';
/**
 * This component represents the login page
 */
var LoginPageComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ActivatedRoute} route
     * @param {Store<AppState>} store
     */
    function LoginPageComponent(route, store) {
        this.route = route;
        this.store = store;
    }
    /**
     * Initialize instance variables
     */
    LoginPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        var queryParamsObs = this.route.queryParams;
        var authenticated = this.store.select(isAuthenticated);
        this.sub = observableCombineLatest(queryParamsObs, authenticated).pipe(filter(function (_a) {
            var params = _a[0], auth = _a[1];
            return isNotEmpty(params.token) || isNotEmpty(params.expired);
        }), take(1)).subscribe(function (_a) {
            var params = _a[0], auth = _a[1];
            var token = params.token;
            var authToken;
            if (!auth) {
                if (isNotEmpty(token)) {
                    authToken = new AuthTokenInfo(token);
                    _this.store.dispatch(new AuthenticatedAction(authToken));
                }
                else if (isNotEmpty(params.expired)) {
                    _this.store.dispatch(new AddAuthenticationMessageAction('auth.messages.expired'));
                }
            }
            else {
                if (isNotEmpty(token)) {
                    authToken = new AuthTokenInfo(token);
                    _this.store.dispatch(new AuthenticationSuccessAction(authToken));
                }
            }
        });
    };
    /**
     * Unsubscribe from subscription
     */
    LoginPageComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
        // Clear all authentication messages when leaving login page
        this.store.dispatch(new ResetAuthenticationMessagesAction());
    };
    LoginPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-login-page',
            styleUrls: ['./login-page.component.scss'],
            templateUrl: './login-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            Store])
    ], LoginPageComponent);
    return LoginPageComponent;
}());
export { LoginPageComponent };
//# sourceMappingURL=login-page.component.js.map
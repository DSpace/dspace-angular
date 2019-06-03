import * as tslib_1 from "tslib";
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { find } from 'lodash';
import { AuthService } from './auth.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { isNotEmpty, isUndefined, isNotNull } from '../../shared/empty.util';
import { RedirectWhenTokenExpiredAction, RefreshTokenAction } from './auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
var AuthInterceptor = /** @class */ (function () {
    function AuthInterceptor(inj, router, store) {
        this.inj = inj;
        this.router = router;
        this.store = store;
        // Intercetor is called twice per request,
        // so to prevent RefreshTokenAction is dispatched twice
        // we're creating a refresh token request list
        this.refreshTokenRequestUrls = [];
    }
    AuthInterceptor.prototype.isUnauthorized = function (response) {
        // invalid_token The access token provided is expired, revoked, malformed, or invalid for other reasons
        return response.status === 401;
    };
    AuthInterceptor.prototype.isSuccess = function (response) {
        return (response.status === 200 || response.status === 204);
    };
    AuthInterceptor.prototype.isAuthRequest = function (http) {
        return http && http.url
            && (http.url.endsWith('/authn/login')
                || http.url.endsWith('/authn/logout')
                || http.url.endsWith('/authn/status'));
    };
    AuthInterceptor.prototype.isLoginResponse = function (http) {
        return http.url && http.url.endsWith('/authn/login');
    };
    AuthInterceptor.prototype.isLogoutResponse = function (http) {
        return http.url && http.url.endsWith('/authn/logout');
    };
    AuthInterceptor.prototype.makeAuthStatusObject = function (authenticated, accessToken, error) {
        var authStatus = new AuthStatus();
        authStatus.id = null;
        authStatus.okay = true;
        if (authenticated) {
            authStatus.authenticated = true;
            authStatus.token = new AuthTokenInfo(accessToken);
        }
        else {
            authStatus.authenticated = false;
            authStatus.error = isNotEmpty(error) ? ((typeof error === 'string') ? JSON.parse(error) : error) : null;
        }
        return authStatus;
    };
    AuthInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        var authService = this.inj.get(AuthService);
        var token = authService.getToken();
        var newReq;
        if (authService.isTokenExpired()) {
            authService.setRedirectUrl(this.router.url);
            // The access token is expired
            // Redirect to the login route
            this.store.dispatch(new RedirectWhenTokenExpiredAction('auth.messages.expired'));
            return observableOf(null);
        }
        else if (!this.isAuthRequest(req) && isNotEmpty(token)) {
            // Intercept a request that is not to the authentication endpoint
            authService.isTokenExpiring().pipe(filter(function (isExpiring) { return isExpiring; }))
                .subscribe(function () {
                // If the current request url is already in the refresh token request list, skip it
                if (isUndefined(find(_this.refreshTokenRequestUrls, req.url))) {
                    // When a token is about to expire, refresh it
                    _this.store.dispatch(new RefreshTokenAction(token));
                    _this.refreshTokenRequestUrls.push(req.url);
                }
            });
            // Get the auth header from the service.
            var Authorization = authService.buildAuthHeader(token);
            // Clone the request to add the new header.
            newReq = req.clone({ headers: req.headers.set('authorization', Authorization) });
        }
        else {
            newReq = req;
        }
        // Pass on the new request instead of the original request.
        return next.handle(newReq).pipe(map(function (response) {
            // Intercept a Login/Logout response
            if (response instanceof HttpResponse && _this.isSuccess(response) && (_this.isLoginResponse(response) || _this.isLogoutResponse(response))) {
                // It's a success Login/Logout response
                var authRes = void 0;
                if (_this.isLoginResponse(response)) {
                    // login successfully
                    var newToken = response.headers.get('authorization');
                    authRes = response.clone({ body: _this.makeAuthStatusObject(true, newToken) });
                    // clean eventually refresh Requests list
                    _this.refreshTokenRequestUrls = [];
                }
                else {
                    // logout successfully
                    authRes = response.clone({ body: _this.makeAuthStatusObject(false) });
                }
                return authRes;
            }
            else {
                return response;
            }
        }), catchError(function (error, caught) {
            // Intercept an error response
            if (error instanceof HttpErrorResponse) {
                // Checks if is a response from a request to an authentication endpoint
                if (_this.isAuthRequest(error)) {
                    // clean eventually refresh Requests list
                    _this.refreshTokenRequestUrls = [];
                    // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
                    var authResponse = new HttpResponse({
                        body: _this.makeAuthStatusObject(false, null, error.error),
                        headers: error.headers,
                        status: error.status,
                        statusText: error.statusText,
                        url: error.url
                    });
                    return observableOf(authResponse);
                }
                else if (_this.isUnauthorized(error) && isNotNull(token) && authService.isTokenExpired()) {
                    // The access token provided is expired, revoked, malformed, or invalid for other reasons
                    // Redirect to the login route
                    _this.store.dispatch(new RedirectWhenTokenExpiredAction('auth.messages.expired'));
                }
            }
            // Return error response as is.
            return observableThrowError(error);
        }));
    };
    AuthInterceptor = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Injector, Router, Store])
    ], AuthInterceptor);
    return AuthInterceptor;
}());
export { AuthInterceptor };
//# sourceMappingURL=auth.interceptor.js.map
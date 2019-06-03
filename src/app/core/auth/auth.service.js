import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AuthRequestService } from './auth-request.service';
import { TOKENITEM } from './models/auth-token-info.model';
import { isEmpty, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { CookieService } from '../../shared/services/cookie.service';
import { getAuthenticationToken, getRedirectUrl, isAuthenticated, isTokenRefreshing } from './selectors';
import { routerStateSelector } from '../../app.reducer';
import { ResetAuthenticationMessagesAction, SetRedirectUrlAction } from './auth.actions';
import { NativeWindowRef, NativeWindowService } from '../../shared/services/window.service';
import { Base64EncodeUrl } from '../../shared/utils/encode-decode.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
export var LOGIN_ROUTE = '/login';
export var LOGOUT_ROUTE = '/logout';
export var REDIRECT_COOKIE = 'dsRedirectUrl';
/**
 * The auth service.
 */
var AuthService = /** @class */ (function () {
    function AuthService(req, _window, authRequestService, response, router, storage, store, rdbService) {
        var _this = this;
        this.req = req;
        this._window = _window;
        this.authRequestService = authRequestService;
        this.response = response;
        this.router = router;
        this.storage = storage;
        this.store = store;
        this.rdbService = rdbService;
        this.store.pipe(select(isAuthenticated), startWith(false)).subscribe(function (authenticated) { return _this._authenticated = authenticated; });
        // If current route is different from the one setted in authentication guard
        // and is not the login route, clear redirect url and messages
        var routeUrl$ = this.store.pipe(select(routerStateSelector), filter(function (routerState) { return isNotUndefined(routerState) && isNotUndefined(routerState.state); }), filter(function (routerState) { return !_this.isLoginRoute(routerState.state.url); }), map(function (routerState) { return routerState.state.url; }));
        var redirectUrl$ = this.store.pipe(select(getRedirectUrl), distinctUntilChanged());
        routeUrl$.pipe(withLatestFrom(redirectUrl$), map(function (_a) {
            var routeUrl = _a[0], redirectUrl = _a[1];
            return [routeUrl, redirectUrl];
        })).pipe(filter(function (_a) {
            var routeUrl = _a[0], redirectUrl = _a[1];
            return isNotEmpty(redirectUrl) && (routeUrl !== redirectUrl);
        }))
            .subscribe(function () {
            _this.clearRedirectUrl();
        });
    }
    /**
     * Check if is a login page route
     *
     * @param {string} url
     * @returns {Boolean}.
     */
    AuthService.prototype.isLoginRoute = function (url) {
        var urlTree = this.router.parseUrl(url);
        var g = urlTree.root.children[PRIMARY_OUTLET];
        var segment = '/' + g.toString();
        return segment === LOGIN_ROUTE;
    };
    /**
     * Authenticate the user
     *
     * @param {string} user The user name
     * @param {string} password The user's password
     * @returns {Observable<User>} The authenticated user observable.
     */
    AuthService.prototype.authenticate = function (user, password) {
        // Attempt authenticating the user using the supplied credentials.
        var body = ("password=" + Base64EncodeUrl(password) + "&user=" + Base64EncodeUrl(user));
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        options.headers = headers;
        return this.authRequestService.postToEndpoint('login', body, options).pipe(map(function (status) {
            if (status.authenticated) {
                return status;
            }
            else {
                throw (new Error('Invalid email or password'));
            }
        }));
    };
    /**
     * Determines if the user is authenticated
     * @returns {Observable<boolean>}
     */
    AuthService.prototype.isAuthenticated = function () {
        return this.store.pipe(select(isAuthenticated));
    };
    /**
     * Returns the authenticated user
     * @returns {User}
     */
    AuthService.prototype.authenticatedUser = function (token) {
        var _this = this;
        // Determine if the user has an existing auth session on the server
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', "Bearer " + token.accessToken);
        options.headers = headers;
        return this.authRequestService.getRequest('status', options).pipe(map(function (status) { return _this.rdbService.build(status); }), switchMap(function (status) {
            if (status.authenticated) {
                return status.eperson.pipe(map(function (eperson) { return eperson.payload; }));
            }
            else {
                throw (new Error('Not authenticated'));
            }
        }));
    };
    /**
     * Checks if token is present into browser storage and is valid. (NB Check is done only on SSR)
     */
    AuthService.prototype.checkAuthenticationToken = function () {
        return;
    };
    /**
     * Checks if token is present into storage and is not expired
     */
    AuthService.prototype.hasValidAuthenticationToken = function () {
        var _this = this;
        return this.store.pipe(select(getAuthenticationToken), take(1), map(function (authTokenInfo) {
            var token;
            // Retrieve authentication token info and check if is valid
            token = isNotEmpty(authTokenInfo) ? authTokenInfo : _this.storage.get(TOKENITEM);
            if (isNotEmpty(token) && token.hasOwnProperty('accessToken') && isNotEmpty(token.accessToken) && !_this.isTokenExpired(token)) {
                return token;
            }
            else {
                throw false;
            }
        }));
    };
    /**
     * Checks if token is present into storage
     */
    AuthService.prototype.refreshAuthenticationToken = function (token) {
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', "Bearer " + token.accessToken);
        options.headers = headers;
        return this.authRequestService.postToEndpoint('login', {}, options).pipe(map(function (status) {
            if (status.authenticated) {
                return status.token;
            }
            else {
                throw (new Error('Not authenticated'));
            }
        }));
    };
    /**
     * Clear authentication errors
     */
    AuthService.prototype.resetAuthenticationError = function () {
        this.store.dispatch(new ResetAuthenticationMessagesAction());
    };
    /**
     * Create a new user
     * @returns {User}
     */
    AuthService.prototype.create = function (user) {
        // Normally you would do an HTTP request to POST the user
        // details and then return the new user object
        // but, let's just return the new user for this example.
        // this._authenticated = true;
        return observableOf(user);
    };
    /**
     * End session
     * @returns {Observable<boolean>}
     */
    AuthService.prototype.logout = function () {
        // Send a request that sign end the session
        var headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var options = Object.create({ headers: headers, responseType: 'text' });
        return this.authRequestService.getRequest('logout', options).pipe(map(function (status) {
            if (!status.authenticated) {
                return true;
            }
            else {
                throw (new Error('auth.errors.invalid-user'));
            }
        }));
    };
    /**
     * Retrieve authentication token info and make authorization header
     * @returns {string}
     */
    AuthService.prototype.buildAuthHeader = function (token) {
        if (isEmpty(token)) {
            token = this.getToken();
        }
        return (this._authenticated && isNotNull(token)) ? "Bearer " + token.accessToken : '';
    };
    /**
     * Get authentication token info
     * @returns {AuthTokenInfo}
     */
    AuthService.prototype.getToken = function () {
        var token;
        this.store.pipe(select(getAuthenticationToken))
            .subscribe(function (authTokenInfo) {
            // Retrieve authentication token info and check if is valid
            token = authTokenInfo || null;
        });
        return token;
    };
    /**
     * Check if a token is next to be expired
     * @returns {boolean}
     */
    AuthService.prototype.isTokenExpiring = function () {
        var _this = this;
        return this.store.pipe(select(isTokenRefreshing), take(1), map(function (isRefreshing) {
            if (_this.isTokenExpired() || isRefreshing) {
                return false;
            }
            else {
                var token = _this.getToken();
                return token.expires - (60 * 5 * 1000) < Date.now();
            }
        }));
    };
    /**
     * Check if a token is expired
     * @returns {boolean}
     */
    AuthService.prototype.isTokenExpired = function (token) {
        token = token || this.getToken();
        return token && token.expires < Date.now();
    };
    /**
     * Save authentication token info
     *
     * @param {AuthTokenInfo} token The token to save
     * @returns {AuthTokenInfo}
     */
    AuthService.prototype.storeToken = function (token) {
        // Add 1 day to the current date
        var expireDate = Date.now() + (1000 * 60 * 60 * 24);
        // Set the cookie expire date
        var expires = new Date(expireDate);
        var options = { expires: expires };
        // Save cookie with the token
        return this.storage.set(TOKENITEM, token, options);
    };
    /**
     * Remove authentication token info
     */
    AuthService.prototype.removeToken = function () {
        return this.storage.remove(TOKENITEM);
    };
    /**
     * Replace authentication token info with a new one
     */
    AuthService.prototype.replaceToken = function (token) {
        this.removeToken();
        return this.storeToken(token);
    };
    /**
     * Redirect to the login route
     */
    AuthService.prototype.redirectToLogin = function () {
        this.router.navigate([LOGIN_ROUTE]);
    };
    /**
     * Redirect to the login route when token has expired
     */
    AuthService.prototype.redirectToLoginWhenTokenExpired = function () {
        var redirectUrl = LOGIN_ROUTE + '?expired=true';
        if (this._window.nativeWindow.location) {
            // Hard redirect to login page, so that all state is definitely lost
            this._window.nativeWindow.location.href = redirectUrl;
        }
        else if (this.response) {
            if (!this.response._headerSent) {
                this.response.redirect(302, redirectUrl);
            }
        }
        else {
            this.router.navigateByUrl(redirectUrl);
        }
    };
    /**
     * Redirect to the route navigated before the login
     */
    AuthService.prototype.redirectToPreviousUrl = function () {
        var _this = this;
        this.getRedirectUrl().pipe(take(1))
            .subscribe(function (redirectUrl) {
            if (isNotEmpty(redirectUrl)) {
                _this.clearRedirectUrl();
                _this.router.onSameUrlNavigation = 'reload';
                var url = decodeURIComponent(redirectUrl);
                _this.router.navigateByUrl(url);
                /* TODO Reenable hard redirect when REST API can handle x-forwarded-for, see https://github.com/DSpace/DSpace/pull/2207 */
                // this._window.nativeWindow.location.href = url;
            }
            else {
                _this.router.navigate(['/']);
                /* TODO Reenable hard redirect when REST API can handle x-forwarded-for, see https://github.com/DSpace/DSpace/pull/2207 */
                // this._window.nativeWindow.location.href = '/';
            }
        });
    };
    /**
     * Refresh route navigated
     */
    AuthService.prototype.refreshAfterLogout = function () {
        this.router.navigate(['/home']);
        // Hard redirect to home page, so that all state is definitely lost
        this._window.nativeWindow.location.href = '/home';
    };
    /**
     * Get redirect url
     */
    AuthService.prototype.getRedirectUrl = function () {
        var redirectUrl = this.storage.get(REDIRECT_COOKIE);
        if (isNotEmpty(redirectUrl)) {
            return observableOf(redirectUrl);
        }
        else {
            return this.store.pipe(select(getRedirectUrl));
        }
    };
    /**
     * Set redirect url
     */
    AuthService.prototype.setRedirectUrl = function (url) {
        // Add 1 hour to the current date
        var expireDate = Date.now() + (1000 * 60 * 60);
        // Set the cookie expire date
        var expires = new Date(expireDate);
        var options = { expires: expires };
        this.storage.set(REDIRECT_COOKIE, url, options);
        this.store.dispatch(new SetRedirectUrlAction(isNotUndefined(url) ? url : ''));
    };
    /**
     * Clear redirect url
     */
    AuthService.prototype.clearRedirectUrl = function () {
        this.store.dispatch(new SetRedirectUrlAction(''));
        this.storage.remove(REDIRECT_COOKIE);
    };
    AuthService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(REQUEST)),
        tslib_1.__param(1, Inject(NativeWindowService)),
        tslib_1.__param(3, Optional()), tslib_1.__param(3, Inject(RESPONSE)),
        tslib_1.__metadata("design:paramtypes", [Object, NativeWindowRef,
            AuthRequestService, Object, Router,
            CookieService,
            Store,
            RemoteDataBuildService])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map
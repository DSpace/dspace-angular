import * as tslib_1 from "tslib";
import { of as observableOf, Observable } from 'rxjs';
import { filter, debounceTime, switchMap, take, tap, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// import @ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
// import services
import { AuthService } from './auth.service';
// import actions
import { AuthActionTypes, AuthenticatedAction, AuthenticatedErrorAction, AuthenticatedSuccessAction, AuthenticationErrorAction, AuthenticationSuccessAction, CheckAuthenticationTokenErrorAction, LogOutErrorAction, LogOutSuccessAction, RefreshTokenErrorAction, RefreshTokenSuccessAction, RegistrationErrorAction, RegistrationSuccessAction } from './auth.actions';
import { isAuthenticated } from './selectors';
import { StoreActionTypes } from '../../store.actions';
var AuthEffects = /** @class */ (function () {
    /**
     * @constructor
     * @param {Actions} actions$
     * @param {AuthService} authService
     * @param {Store} store
     */
    function AuthEffects(actions$, authService, store) {
        var _this = this;
        this.actions$ = actions$;
        this.authService = authService;
        this.store = store;
        /**
         * Authenticate user.
         * @method authenticate
         */
        this.authenticate$ = this.actions$.pipe(ofType(AuthActionTypes.AUTHENTICATE), switchMap(function (action) {
            return _this.authService.authenticate(action.payload.email, action.payload.password).pipe(take(1), map(function (response) { return new AuthenticationSuccessAction(response.token); }), catchError(function (error) { return observableOf(new AuthenticationErrorAction(error)); }));
        }));
        this.authenticateSuccess$ = this.actions$.pipe(ofType(AuthActionTypes.AUTHENTICATE_SUCCESS), tap(function (action) { return _this.authService.storeToken(action.payload); }), map(function (action) { return new AuthenticatedAction(action.payload); }));
        this.authenticated$ = this.actions$.pipe(ofType(AuthActionTypes.AUTHENTICATED), switchMap(function (action) {
            return _this.authService.authenticatedUser(action.payload).pipe(map(function (user) { return new AuthenticatedSuccessAction((user !== null), action.payload, user); }), catchError(function (error) { return observableOf(new AuthenticatedErrorAction(error)); }));
        }));
        // It means "reacts to this action but don't send another"
        this.authenticatedError$ = this.actions$.pipe(ofType(AuthActionTypes.AUTHENTICATED_ERROR), tap(function (action) { return _this.authService.removeToken(); }));
        this.checkToken$ = this.actions$.pipe(ofType(AuthActionTypes.CHECK_AUTHENTICATION_TOKEN), switchMap(function () {
            return _this.authService.hasValidAuthenticationToken().pipe(map(function (token) { return new AuthenticatedAction(token); }), catchError(function (error) { return observableOf(new CheckAuthenticationTokenErrorAction()); }));
        }));
        this.createUser$ = this.actions$.pipe(ofType(AuthActionTypes.REGISTRATION), debounceTime(500), // to remove when functionality is implemented
        switchMap(function (action) {
            return _this.authService.create(action.payload).pipe(map(function (user) { return new RegistrationSuccessAction(user); }), catchError(function (error) { return observableOf(new RegistrationErrorAction(error)); }));
        }));
        this.refreshToken$ = this.actions$.pipe(ofType(AuthActionTypes.REFRESH_TOKEN), switchMap(function (action) {
            return _this.authService.refreshAuthenticationToken(action.payload).pipe(map(function (token) { return new RefreshTokenSuccessAction(token); }), catchError(function (error) { return observableOf(new RefreshTokenErrorAction()); }));
        }));
        // It means "reacts to this action but don't send another"
        this.refreshTokenSuccess$ = this.actions$.pipe(ofType(AuthActionTypes.REFRESH_TOKEN_SUCCESS), tap(function (action) { return _this.authService.replaceToken(action.payload); }));
        /**
         * When the store is rehydrated in the browser,
         * clear a possible invalid token or authentication errors
         */
        this.clearInvalidTokenOnRehydrate$ = this.actions$.pipe(ofType(StoreActionTypes.REHYDRATE), switchMap(function () {
            return _this.store.pipe(select(isAuthenticated), take(1), filter(function (authenticated) { return !authenticated; }), tap(function () { return _this.authService.removeToken(); }), tap(function () { return _this.authService.resetAuthenticationError(); }));
        }));
        this.logOut$ = this.actions$
            .pipe(ofType(AuthActionTypes.LOG_OUT), switchMap(function () {
            return _this.authService.logout().pipe(map(function (value) { return new LogOutSuccessAction(); }), catchError(function (error) { return observableOf(new LogOutErrorAction(error)); }));
        }));
        this.logOutSuccess$ = this.actions$
            .pipe(ofType(AuthActionTypes.LOG_OUT_SUCCESS), tap(function () { return _this.authService.removeToken(); }), tap(function () { return _this.authService.clearRedirectUrl(); }), tap(function () { return _this.authService.refreshAfterLogout(); }));
        this.redirectToLogin$ = this.actions$
            .pipe(ofType(AuthActionTypes.REDIRECT_AUTHENTICATION_REQUIRED), tap(function () { return _this.authService.removeToken(); }), tap(function () { return _this.authService.redirectToLogin(); }));
        this.redirectToLoginTokenExpired$ = this.actions$
            .pipe(ofType(AuthActionTypes.REDIRECT_TOKEN_EXPIRED), tap(function () { return _this.authService.removeToken(); }), tap(function () { return _this.authService.redirectToLoginWhenTokenExpired(); }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "authenticate$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "authenticateSuccess$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "authenticated$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "authenticatedError$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "checkToken$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "createUser$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "refreshToken$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "refreshTokenSuccess$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "clearInvalidTokenOnRehydrate$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "logOut$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "logOutSuccess$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "redirectToLogin$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], AuthEffects.prototype, "redirectToLoginTokenExpired$", void 0);
    AuthEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            AuthService,
            Store])
    ], AuthEffects);
    return AuthEffects;
}());
export { AuthEffects };
//# sourceMappingURL=auth.effects.js.map
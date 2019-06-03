import * as tslib_1 from "tslib";
import { filter, map, takeWhile } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AuthenticateAction, ResetAuthenticationMessagesAction } from '../../core/auth/auth.actions';
import { getAuthenticationError, getAuthenticationInfo, isAuthenticated, isAuthenticationLoading, } from '../../core/auth/selectors';
import { isNotEmpty } from '../empty.util';
import { fadeOut } from '../animations/fade';
import { AuthService } from '../../core/auth/auth.service';
/**
 * /users/sign-in
 * @class LogInComponent
 */
var LogInComponent = /** @class */ (function () {
    /**
     * @constructor
     * @param {AuthService} authService
     * @param {FormBuilder} formBuilder
     * @param {Store<State>} store
     */
    function LogInComponent(authService, formBuilder, store) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.store = store;
        /**
         * Has authentication error.
         * @type {boolean}
         */
        this.hasError = false;
        /**
         * Has authentication message.
         * @type {boolean}
         */
        this.hasMessage = false;
        /**
         * Component state.
         * @type {boolean}
         */
        this.alive = true;
    }
    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * @method ngOnInit
     */
    LogInComponent.prototype.ngOnInit = function () {
        var _this = this;
        // set isAuthenticated
        this.isAuthenticated = this.store.pipe(select(isAuthenticated));
        // set formGroup
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        // set error
        this.error = this.store.pipe(select(getAuthenticationError), map(function (error) {
            _this.hasError = (isNotEmpty(error));
            return error;
        }));
        // set error
        this.message = this.store.pipe(select(getAuthenticationInfo), map(function (message) {
            _this.hasMessage = (isNotEmpty(message));
            return message;
        }));
        // set loading
        this.loading = this.store.pipe(select(isAuthenticationLoading));
        // subscribe to success
        this.store.pipe(select(isAuthenticated), takeWhile(function () { return _this.alive; }), filter(function (authenticated) { return authenticated; }))
            .subscribe(function () {
            _this.authService.redirectToPreviousUrl();
        });
    };
    /**
     *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
     * @method ngOnDestroy
     */
    LogInComponent.prototype.ngOnDestroy = function () {
        this.alive = false;
    };
    /**
     * Reset error or message.
     */
    LogInComponent.prototype.resetErrorOrMessage = function () {
        if (this.hasError || this.hasMessage) {
            this.store.dispatch(new ResetAuthenticationMessagesAction());
            this.hasError = false;
            this.hasMessage = false;
        }
    };
    /**
     * To the registration page.
     * @method register
     */
    LogInComponent.prototype.register = function () {
        // TODO enable after registration process is done
        // this.router.navigate(['/register']);
    };
    /**
     * Submit the authentication form.
     * @method submit
     */
    LogInComponent.prototype.submit = function () {
        this.resetErrorOrMessage();
        // get email and password values
        var email = this.form.get('email').value;
        var password = this.form.get('password').value;
        // trim values
        email.trim();
        password.trim();
        // dispatch AuthenticationAction
        this.store.dispatch(new AuthenticateAction(email, password));
        // clear form
        this.form.reset();
    };
    LogInComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-log-in',
            templateUrl: './log-in.component.html',
            styleUrls: ['./log-in.component.scss'],
            animations: [fadeOut]
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService,
            FormBuilder,
            Store])
    ], LogInComponent);
    return LogInComponent;
}());
export { LogInComponent };
//# sourceMappingURL=log-in.component.js.map
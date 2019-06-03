// import type function
import { type } from '../../shared/ngrx/type';
export var AuthActionTypes = {
    AUTHENTICATE: type('dspace/auth/AUTHENTICATE'),
    AUTHENTICATE_ERROR: type('dspace/auth/AUTHENTICATE_ERROR'),
    AUTHENTICATE_SUCCESS: type('dspace/auth/AUTHENTICATE_SUCCESS'),
    AUTHENTICATED: type('dspace/auth/AUTHENTICATED'),
    AUTHENTICATED_ERROR: type('dspace/auth/AUTHENTICATED_ERROR'),
    AUTHENTICATED_SUCCESS: type('dspace/auth/AUTHENTICATED_SUCCESS'),
    CHECK_AUTHENTICATION_TOKEN: type('dspace/auth/CHECK_AUTHENTICATION_TOKEN'),
    CHECK_AUTHENTICATION_TOKEN_ERROR: type('dspace/auth/CHECK_AUTHENTICATION_TOKEN_ERROR'),
    REDIRECT_TOKEN_EXPIRED: type('dspace/auth/REDIRECT_TOKEN_EXPIRED'),
    REDIRECT_AUTHENTICATION_REQUIRED: type('dspace/auth/REDIRECT_AUTHENTICATION_REQUIRED'),
    REFRESH_TOKEN: type('dspace/auth/REFRESH_TOKEN'),
    REFRESH_TOKEN_SUCCESS: type('dspace/auth/REFRESH_TOKEN_SUCCESS'),
    REFRESH_TOKEN_ERROR: type('dspace/auth/REFRESH_TOKEN_ERROR'),
    ADD_MESSAGE: type('dspace/auth/ADD_MESSAGE'),
    RESET_MESSAGES: type('dspace/auth/RESET_MESSAGES'),
    LOG_OUT: type('dspace/auth/LOG_OUT'),
    LOG_OUT_ERROR: type('dspace/auth/LOG_OUT_ERROR'),
    LOG_OUT_SUCCESS: type('dspace/auth/LOG_OUT_SUCCESS'),
    REGISTRATION: type('dspace/auth/REGISTRATION'),
    REGISTRATION_ERROR: type('dspace/auth/REGISTRATION_ERROR'),
    REGISTRATION_SUCCESS: type('dspace/auth/REGISTRATION_SUCCESS'),
    SET_REDIRECT_URL: type('dspace/auth/SET_REDIRECT_URL'),
};
/* tslint:disable:max-classes-per-file */
/**
 * Authenticate.
 * @class AuthenticateAction
 * @implements {Action}
 */
var AuthenticateAction = /** @class */ (function () {
    function AuthenticateAction(email, password) {
        this.type = AuthActionTypes.AUTHENTICATE;
        this.payload = { email: email, password: password };
    }
    return AuthenticateAction;
}());
export { AuthenticateAction };
/**
 * Checks if user is authenticated.
 * @class AuthenticatedAction
 * @implements {Action}
 */
var AuthenticatedAction = /** @class */ (function () {
    function AuthenticatedAction(token) {
        this.type = AuthActionTypes.AUTHENTICATED;
        this.payload = token;
    }
    return AuthenticatedAction;
}());
export { AuthenticatedAction };
/**
 * Authenticated check success.
 * @class AuthenticatedSuccessAction
 * @implements {Action}
 */
var AuthenticatedSuccessAction = /** @class */ (function () {
    function AuthenticatedSuccessAction(authenticated, authToken, user) {
        this.type = AuthActionTypes.AUTHENTICATED_SUCCESS;
        this.payload = { authenticated: authenticated, authToken: authToken, user: user };
    }
    return AuthenticatedSuccessAction;
}());
export { AuthenticatedSuccessAction };
/**
 * Authenticated check error.
 * @class AuthenticatedErrorAction
 * @implements {Action}
 */
var AuthenticatedErrorAction = /** @class */ (function () {
    function AuthenticatedErrorAction(payload) {
        this.type = AuthActionTypes.AUTHENTICATED_ERROR;
        this.payload = payload;
    }
    return AuthenticatedErrorAction;
}());
export { AuthenticatedErrorAction };
/**
 * Authentication error.
 * @class AuthenticationErrorAction
 * @implements {Action}
 */
var AuthenticationErrorAction = /** @class */ (function () {
    function AuthenticationErrorAction(payload) {
        this.type = AuthActionTypes.AUTHENTICATE_ERROR;
        this.payload = payload;
    }
    return AuthenticationErrorAction;
}());
export { AuthenticationErrorAction };
/**
 * Authentication success.
 * @class AuthenticationSuccessAction
 * @implements {Action}
 */
var AuthenticationSuccessAction = /** @class */ (function () {
    function AuthenticationSuccessAction(token) {
        this.type = AuthActionTypes.AUTHENTICATE_SUCCESS;
        this.payload = token;
    }
    return AuthenticationSuccessAction;
}());
export { AuthenticationSuccessAction };
/**
 * Check if token is already present upon initial load.
 * @class CheckAuthenticationTokenAction
 * @implements {Action}
 */
var CheckAuthenticationTokenAction = /** @class */ (function () {
    function CheckAuthenticationTokenAction() {
        this.type = AuthActionTypes.CHECK_AUTHENTICATION_TOKEN;
    }
    return CheckAuthenticationTokenAction;
}());
export { CheckAuthenticationTokenAction };
/**
 * Check Authentication Token Error.
 * @class CheckAuthenticationTokenErrorAction
 * @implements {Action}
 */
var CheckAuthenticationTokenErrorAction = /** @class */ (function () {
    function CheckAuthenticationTokenErrorAction() {
        this.type = AuthActionTypes.CHECK_AUTHENTICATION_TOKEN_ERROR;
    }
    return CheckAuthenticationTokenErrorAction;
}());
export { CheckAuthenticationTokenErrorAction };
/**
 * Sign out.
 * @class LogOutAction
 * @implements {Action}
 */
var LogOutAction = /** @class */ (function () {
    function LogOutAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOG_OUT;
    }
    return LogOutAction;
}());
export { LogOutAction };
/**
 * Sign out error.
 * @class LogOutErrorAction
 * @implements {Action}
 */
var LogOutErrorAction = /** @class */ (function () {
    function LogOutErrorAction(payload) {
        this.type = AuthActionTypes.LOG_OUT_ERROR;
        this.payload = payload;
    }
    return LogOutErrorAction;
}());
export { LogOutErrorAction };
/**
 * Sign out success.
 * @class LogOutSuccessAction
 * @implements {Action}
 */
var LogOutSuccessAction = /** @class */ (function () {
    function LogOutSuccessAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOG_OUT_SUCCESS;
    }
    return LogOutSuccessAction;
}());
export { LogOutSuccessAction };
/**
 * Redirect to login page when authentication is required.
 * @class RedirectWhenAuthenticationIsRequiredAction
 * @implements {Action}
 */
var RedirectWhenAuthenticationIsRequiredAction = /** @class */ (function () {
    function RedirectWhenAuthenticationIsRequiredAction(message) {
        this.type = AuthActionTypes.REDIRECT_AUTHENTICATION_REQUIRED;
        this.payload = message;
    }
    return RedirectWhenAuthenticationIsRequiredAction;
}());
export { RedirectWhenAuthenticationIsRequiredAction };
/**
 * Redirect to login page when token is expired.
 * @class RedirectWhenTokenExpiredAction
 * @implements {Action}
 */
var RedirectWhenTokenExpiredAction = /** @class */ (function () {
    function RedirectWhenTokenExpiredAction(message) {
        this.type = AuthActionTypes.REDIRECT_TOKEN_EXPIRED;
        this.payload = message;
    }
    return RedirectWhenTokenExpiredAction;
}());
export { RedirectWhenTokenExpiredAction };
/**
 * Refresh authentication token.
 * @class RefreshTokenAction
 * @implements {Action}
 */
var RefreshTokenAction = /** @class */ (function () {
    function RefreshTokenAction(token) {
        this.type = AuthActionTypes.REFRESH_TOKEN;
        this.payload = token;
    }
    return RefreshTokenAction;
}());
export { RefreshTokenAction };
/**
 * Refresh authentication token success.
 * @class RefreshTokenSuccessAction
 * @implements {Action}
 */
var RefreshTokenSuccessAction = /** @class */ (function () {
    function RefreshTokenSuccessAction(token) {
        this.type = AuthActionTypes.REFRESH_TOKEN_SUCCESS;
        this.payload = token;
    }
    return RefreshTokenSuccessAction;
}());
export { RefreshTokenSuccessAction };
/**
 * Refresh authentication token error.
 * @class RefreshTokenErrorAction
 * @implements {Action}
 */
var RefreshTokenErrorAction = /** @class */ (function () {
    function RefreshTokenErrorAction() {
        this.type = AuthActionTypes.REFRESH_TOKEN_ERROR;
    }
    return RefreshTokenErrorAction;
}());
export { RefreshTokenErrorAction };
/**
 * Sign up.
 * @class RegistrationAction
 * @implements {Action}
 */
var RegistrationAction = /** @class */ (function () {
    function RegistrationAction(user) {
        this.type = AuthActionTypes.REGISTRATION;
        this.payload = user;
    }
    return RegistrationAction;
}());
export { RegistrationAction };
/**
 * Sign up error.
 * @class RegistrationErrorAction
 * @implements {Action}
 */
var RegistrationErrorAction = /** @class */ (function () {
    function RegistrationErrorAction(payload) {
        this.type = AuthActionTypes.REGISTRATION_ERROR;
        this.payload = payload;
    }
    return RegistrationErrorAction;
}());
export { RegistrationErrorAction };
/**
 * Sign up success.
 * @class RegistrationSuccessAction
 * @implements {Action}
 */
var RegistrationSuccessAction = /** @class */ (function () {
    function RegistrationSuccessAction(user) {
        this.type = AuthActionTypes.REGISTRATION_SUCCESS;
        this.payload = user;
    }
    return RegistrationSuccessAction;
}());
export { RegistrationSuccessAction };
/**
 * Add uthentication message.
 * @class AddAuthenticationMessageAction
 * @implements {Action}
 */
var AddAuthenticationMessageAction = /** @class */ (function () {
    function AddAuthenticationMessageAction(message) {
        this.type = AuthActionTypes.ADD_MESSAGE;
        this.payload = message;
    }
    return AddAuthenticationMessageAction;
}());
export { AddAuthenticationMessageAction };
/**
 * Reset error.
 * @class ResetAuthenticationMessagesAction
 * @implements {Action}
 */
var ResetAuthenticationMessagesAction = /** @class */ (function () {
    function ResetAuthenticationMessagesAction() {
        this.type = AuthActionTypes.RESET_MESSAGES;
    }
    return ResetAuthenticationMessagesAction;
}());
export { ResetAuthenticationMessagesAction };
/**
 * Change the redirect url.
 * @class SetRedirectUrlAction
 * @implements {Action}
 */
var SetRedirectUrlAction = /** @class */ (function () {
    function SetRedirectUrlAction(url) {
        this.type = AuthActionTypes.SET_REDIRECT_URL;
        this.payload = url;
    }
    return SetRedirectUrlAction;
}());
export { SetRedirectUrlAction };
//# sourceMappingURL=auth.actions.js.map
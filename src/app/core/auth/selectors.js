import { createSelector } from '@ngrx/store';
import { EPerson } from '../eperson/models/eperson.model';
/**
 * Returns the user state.
 * @function getUserState
 * @param {AppState} state Top level state.
 * @return {AuthState}
 */
export var getAuthState = function (state) { return state.core.auth; };
/**
 * Returns true if the user is authenticated.
 * @function _isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
var _isAuthenticated = function (state) { return state.authenticated; };
/**
 * Returns true if the authenticated has loaded.
 * @function _isAuthenticatedLoaded
 * @param {State} state
 * @returns {boolean}
 */
var _isAuthenticatedLoaded = function (state) { return state.loaded; };
/**
 * Return the users state
 * NOTE: when state is REHYDRATED user object lose prototype so return always a new EPerson object
 * @function _getAuthenticatedUser
 * @param {State} state
 * @returns {EPerson}
 */
var _getAuthenticatedUser = function (state) { return Object.assign(new EPerson(), state.user); };
/**
 * Returns the authentication error.
 * @function _getAuthenticationError
 * @param {State} state
 * @returns {string}
 */
var _getAuthenticationError = function (state) { return state.error; };
/**
 * Returns the authentication info message.
 * @function _getAuthenticationInfo
 * @param {State} state
 * @returns {string}
 */
var _getAuthenticationInfo = function (state) { return state.info; };
/**
 * Returns true if request is in progress.
 * @function _isLoading
 * @param {State} state
 * @returns {boolean}
 */
var _isLoading = function (state) { return state.loading; };
/**
 * Returns true if a refresh token request is in progress.
 * @function _isRefreshing
 * @param {State} state
 * @returns {boolean}
 */
var _isRefreshing = function (state) { return state.refreshing; };
/**
 * Returns the authentication token.
 * @function _getAuthenticationToken
 * @param {State} state
 * @returns {AuthToken}
 */
var _getAuthenticationToken = function (state) { return state.authToken; };
/**
 * Returns the sign out error.
 * @function _getLogOutError
 * @param {State} state
 * @returns {string}
 */
var _getLogOutError = function (state) { return state.error; };
/**
 * Returns the sign up error.
 * @function _getRegistrationError
 * @param {State} state
 * @returns {string}
 */
var _getRegistrationError = function (state) { return state.error; };
/**
 * Returns the redirect url.
 * @function _getRedirectUrl
 * @param {State} state
 * @returns {string}
 */
var _getRedirectUrl = function (state) { return state.redirectUrl; };
/**
 * Returns the authenticated user
 * @function getAuthenticatedUser
 * @param {AuthState} state
 * @param {any} props
 * @return {User}
 */
export var getAuthenticatedUser = createSelector(getAuthState, _getAuthenticatedUser);
/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export var getAuthenticationError = createSelector(getAuthState, _getAuthenticationError);
/**
 * Returns the authentication info message.
 * @function getAuthenticationInfo
 * @param {AuthState} state
 * @param {any} props
 * @return {string}
 */
export var getAuthenticationInfo = createSelector(getAuthState, _getAuthenticationInfo);
/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export var isAuthenticated = createSelector(getAuthState, _isAuthenticated);
/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export var isAuthenticatedLoaded = createSelector(getAuthState, _isAuthenticatedLoaded);
/**
 * Returns true if the authentication request is loading.
 * @function isAuthenticationLoading
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export var isAuthenticationLoading = createSelector(getAuthState, _isLoading);
/**
 * Returns true if the refresh token request is loading.
 * @function isTokenRefreshing
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export var isTokenRefreshing = createSelector(getAuthState, _isRefreshing);
/**
 * Returns the authentication token.
 * @function getAuthenticationToken
 * @param {State} state
 * @returns {AuthToken}
 */
export var getAuthenticationToken = createSelector(getAuthState, _getAuthenticationToken);
/**
 * Returns the log out error.
 * @function getLogOutError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export var getLogOutError = createSelector(getAuthState, _getLogOutError);
/**
 * Returns the registration error.
 * @function getRegistrationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export var getRegistrationError = createSelector(getAuthState, _getRegistrationError);
/**
 * Returns the redirect url.
 * @function getRedirectUrl
 * @param {AuthState} state
 * @param {any} props
 * @return {string}
 */
export var getRedirectUrl = createSelector(getAuthState, _getRedirectUrl);
//# sourceMappingURL=selectors.js.map
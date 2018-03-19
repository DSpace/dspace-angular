import { createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducers';
import { coreSelector, CoreState } from '../core.reducers';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as auth from './auth.reducers';
import { AppState } from '../../app.reducer';

/**
 * Returns the user state.
 * @function getUserState
 * @param {AppState} state Top level state.
 * @return {AuthState}
 */
export const getAuthState = (state: any) => state.core.auth;

/**
 * Returns the authenticated user
 * @function getAuthenticatedUser
 * @param {AuthState} state
 * @param {any} props
 * @return {User}
 */
export const getAuthenticatedUser = createSelector(getAuthState, auth._getAuthenticatedUser);

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getAuthenticationError = createSelector(getAuthState, auth._getAuthenticationError);

/**
 * Returns the authentication info message.
 * @function getAuthenticationInfo
 * @param {AuthState} state
 * @param {any} props
 * @return {string}
 */
export const getAuthenticationInfo = createSelector(getAuthState, auth._getAuthenticationInfo);

/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticated = createSelector(getAuthState, auth._isAuthenticated);

/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticatedLoaded = createSelector(getAuthState, auth._isAuthenticatedLoaded);

/**
 * Returns true if the authentication request is loading.
 * @function isAuthenticationLoading
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticationLoading = createSelector(getAuthState, auth._isLoading);

/**
 * Returns true if the refresh token request is loading.
 * @function isTokenRefreshing
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isTokenRefreshing = createSelector(getAuthState, auth._isRefreshing);

/**
 * Returns the log out error.
 * @function getLogOutError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getLogOutError = createSelector(getAuthState, auth._getLogOutError);

/**
 * Returns the registration error.
 * @function getRegistrationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getRegistrationError = createSelector(getAuthState, auth._getRegistrationError);

/**
 * Returns the redirect url.
 * @function getRedirectUrl
 * @param {AuthState} state
 * @param {any} props
 * @return {string}
 */
export const getRedirectUrl = createSelector(getAuthState, auth._getRedirectUrl);

/**
 * Returns the sso login url.
 * @function getSSOLoginUrl
 * @param {AuthState} state
 * @param {any} props
 * @return {string}
 */
export const getSSOLoginUrl = createSelector(getAuthState, auth._getSSOLoginUrl);

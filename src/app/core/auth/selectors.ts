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
export const getAuthenticatedUser = createSelector(getAuthState, auth.getAuthenticatedUser);

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getAuthenticationError = createSelector(getAuthState, auth.getAuthenticationError);

/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticated = createSelector(getAuthState, auth.isAuthenticated);

/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticatedLoaded = createSelector(getAuthState, auth.isAuthenticatedLoaded);

/**
 * Returns true if the authentication request is loading.
 * @function isAuthenticationLoading
 * @param {AuthState} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticationLoading = createSelector(getAuthState, auth.isLoading);

/**
 * Returns the log out error.
 * @function getLogOutError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getLogOutError = createSelector(getAuthState, auth.getLogOutError);

/**
 * Returns the registration error.
 * @function getRegistrationError
 * @param {AuthState} state
 * @param {any} props
 * @return {Error}
 */
export const getRegistrationError = createSelector(getAuthState, auth.getRegistrationError);

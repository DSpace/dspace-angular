// import actions
import {
  AddAuthenticationMessageAction,
  AuthActions, AuthActionTypes, AuthenticatedSuccessAction, AuthenticationErrorAction,
  AuthenticationSuccessAction, LogOutErrorAction, RedirectWhenAuthenticationIsRequiredAction,
  RedirectWhenTokenExpiredAction, RefreshTokenSuccessAction, SetRedirectUrlAction
} from './auth.actions';

// import models
import { Eperson } from '../eperson/models/eperson.model';
import { AuthTokenInfo } from './models/auth-token-info.model';

/**
 * The auth state.
 * @interface State
 */
export interface AuthState {

  // boolean if user is authenticated
  authenticated: boolean;

  // the authentication token
  authToken?: AuthTokenInfo;

  // error message
  error?: string;

  // true if we have attempted existing auth session
  loaded: boolean;

  // true when loading
  loading: boolean;

  // info message
  info?: string;

  // redirect url after login
  redirectUrl?: string;

  // true when refreshing token
  refreshing?: boolean;

  // the authenticated user
  user?: Eperson;
}

/**
 * The initial state.
 */
const initialState: AuthState = {
  authenticated: false,
  loaded: false,
  loading: false,
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {AuthActions} action Incoming action
 */
export function authReducer(state: any = initialState, action: AuthActions): AuthState {

  switch (action.type) {
    case AuthActionTypes.AUTHENTICATE:
      return Object.assign({}, state, {
        error: undefined,
        loading: true,
        info: undefined
      });

    case AuthActionTypes.AUTHENTICATED_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        authToken: undefined,
        error: (action as AuthenticationErrorAction).payload.message,
        loaded: true,
        loading: false
      });

    case AuthActionTypes.AUTHENTICATED_SUCCESS:
      return Object.assign({}, state, {
        authenticated: true,
        authToken: (action as AuthenticatedSuccessAction).payload.authToken,
        loaded: true,
        error: undefined,
        loading: false,
        info: undefined,
        user: (action as AuthenticatedSuccessAction).payload.user
      });

    case AuthActionTypes.AUTHENTICATE_ERROR:
    case AuthActionTypes.REGISTRATION_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        authToken: undefined,
        error: (action as AuthenticationErrorAction).payload.message,
        loading: false
      });

    case AuthActionTypes.AUTHENTICATE_SUCCESS:
      return state;

    case AuthActionTypes.CHECK_AUTHENTICATION_TOKEN:
      return Object.assign({}, state, {
        loading: true
      });

    case AuthActionTypes.CHECK_AUTHENTICATION_TOKEN_ERROR:
      return Object.assign({}, state, {
        loading: false
      });

    case AuthActionTypes.LOG_OUT_ERROR:
      return Object.assign({}, state, {
        authenticated: true,
        error: (action as LogOutErrorAction).payload.message,
        user: undefined
      });

    case AuthActionTypes.LOG_OUT_SUCCESS:
    case AuthActionTypes.REFRESH_TOKEN_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        authToken: undefined,
        error: undefined,
        loaded: false,
        loading: false,
        info: undefined,
        refreshing: false,
        user: undefined
      });

    case AuthActionTypes.REDIRECT_AUTHENTICATION_REQUIRED:
    case AuthActionTypes.REDIRECT_TOKEN_EXPIRED:
      return Object.assign({}, state, {
        authenticated: false,
        authToken: undefined,
        loaded: false,
        loading: false,
        info: (action as RedirectWhenTokenExpiredAction as RedirectWhenAuthenticationIsRequiredAction).payload,
        user: undefined
      });

    case AuthActionTypes.REGISTRATION:
      return Object.assign({}, state, {
        authenticated: false,
        authToken: undefined,
        error: undefined,
        loading: true,
        info: undefined
      });

    case AuthActionTypes.REGISTRATION_SUCCESS:
      return state;

    case AuthActionTypes.REFRESH_TOKEN:
      return Object.assign({}, state, {
        refreshing: true,
      });

    case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        authToken: (action as RefreshTokenSuccessAction).payload,
        refreshing: false,
      });

    case AuthActionTypes.ADD_MESSAGE:
      return Object.assign({}, state, {
        info: (action as AddAuthenticationMessageAction).payload,
      });

    case AuthActionTypes.RESET_MESSAGES:
      return Object.assign({}, state, {
        error: undefined,
        info: undefined,
      });

    case AuthActionTypes.SET_REDIRECT_URL:
      return Object.assign({}, state, {
        redirectUrl: (action as SetRedirectUrlAction).payload,
      });

    default:
      return state;
  }
}

/**
 * Returns true if the user is authenticated.
 * @function _isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
export const _isAuthenticated = (state: AuthState) => state.authenticated;

/**
 * Returns true if the authenticated has loaded.
 * @function _isAuthenticatedLoaded
 * @param {State} state
 * @returns {boolean}
 */
export const _isAuthenticatedLoaded = (state: AuthState) => state.loaded;

/**
 * Return the users state
 * @function _getAuthenticatedUser
 * @param {State} state
 * @returns {User}
 */
export const _getAuthenticatedUser = (state: AuthState) => state.user;

/**
 * Returns the authentication error.
 * @function _getAuthenticationError
 * @param {State} state
 * @returns {string}
 */
export const _getAuthenticationError = (state: AuthState) => state.error;

/**
 * Returns the authentication info message.
 * @function _getAuthenticationInfo
 * @param {State} state
 * @returns {string}
 */
export const _getAuthenticationInfo = (state: AuthState) => state.info;

/**
 * Returns true if request is in progress.
 * @function _isLoading
 * @param {State} state
 * @returns {boolean}
 */
export const _isLoading = (state: AuthState) => state.loading;

/**
 * Returns true if a refresh token request is in progress.
 * @function _isRefreshing
 * @param {State} state
 * @returns {boolean}
 */
export const _isRefreshing = (state: AuthState) => state.refreshing;

/**
 * Returns the authentication token.
 * @function _getAuthenticationToken
 * @param {State} state
 * @returns {AuthToken}
 */
export const _getAuthenticationToken = (state: AuthState) => state.authToken;

/**
 * Returns the sign out error.
 * @function _getLogOutError
 * @param {State} state
 * @returns {string}
 */
export const _getLogOutError = (state: AuthState) => state.error;

/**
 * Returns the sign up error.
 * @function _getRegistrationError
 * @param {State} state
 * @returns {string}
 */
export const _getRegistrationError = (state: AuthState) => state.error;

/**
 * Returns the redirect url.
 * @function _getRedirectUrl
 * @param {State} state
 * @returns {string}
 */
export const _getRedirectUrl = (state: AuthState) => state.redirectUrl;

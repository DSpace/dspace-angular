// import actions
import {
  AuthActions, AuthActionTypes, AuthenticatedSuccessAction, AuthenticationErrorAction,
  AuthenticationSuccessAction, LogOutErrorAction
} from './auth.actions';

// import models
import { Eperson } from '../eperson/models/eperson.model';

/**
 * The auth state.
 * @interface State
 */
export interface AuthState {

  // boolean if user is authenticated
  authenticated: boolean;

  // error message
  error?: string;

  // true if we have attempted existing auth session
  loaded: boolean;

  // true when loading
  loading: boolean;

  // the authenticated user
  user?: Eperson;
}

/**
 * The initial state.
 */
const initialState: AuthState = {
  authenticated: null,
  loaded: false,
  loading: false
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
        loading: true
      });

    case AuthActionTypes.AUTHENTICATED_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        error: (action as AuthenticationErrorAction).payload.message,
        loaded: true
      });

    case AuthActionTypes.AUTHENTICATED_SUCCESS:
      return Object.assign({}, state, {
        authenticated: (action as AuthenticatedSuccessAction).payload.authenticated,
        loaded: true,
        user: (action as AuthenticatedSuccessAction).payload.user
      });

    case AuthActionTypes.AUTHENTICATE_ERROR:
    case AuthActionTypes.REGISTRATION_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        error: (action as AuthenticationErrorAction).payload.message,
        loading: false
      });

    case AuthActionTypes.AUTHENTICATE_SUCCESS:
    case AuthActionTypes.REGISTRATION_SUCCESS:
      const user: Eperson = (action as AuthenticationSuccessAction).payload;

      // verify user is not null
      if (user === null) {
        return state;
      }

      return Object.assign({}, state, {
        authenticated: true,
        error: undefined,
        loading: false,
        user: user
      });

    case AuthActionTypes.RESET_ERROR:
      return Object.assign({}, state, {
        authenticated: null,
        loaded: false,
        loading: false
      });

    case AuthActionTypes.LOG_OUT_ERROR:
      return Object.assign({}, state, {
        authenticated: true,
        error: (action as LogOutErrorAction).payload.message,
        user: undefined
      });

    case AuthActionTypes.LOG_OUT_SUCCESS:
      return Object.assign({}, state, {
        authenticated: false,
        error: undefined,
        user: undefined
      });

    case AuthActionTypes.REGISTRATION:
      return Object.assign({}, state, {
        authenticated: false,
        error: undefined,
        loading: true
      });

    default:
      return state;
  }
}

/**
 * Returns true if the user is authenticated.
 * @function isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticated = (state: AuthState) => state.authenticated;

/**
 * Returns true if the authenticated has loaded.
 * @function isAuthenticatedLoaded
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticatedLoaded = (state: AuthState) => state.loaded;

/**
 * Return the users state
 * @function getAuthenticatedUser
 * @param {State} state
 * @returns {User}
 */
export const getAuthenticatedUser = (state: AuthState) => state.user;

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {State} state
 * @returns {Error}
 */
export const getAuthenticationError = (state: AuthState) => state.error;

/**
 * Returns true if request is in progress.
 * @function isLoading
 * @param {State} state
 * @returns {boolean}
 */
export const isLoading = (state: AuthState) => state.loading;

/**
 * Returns the sign out error.
 * @function getLogOutError
 * @param {State} state
 * @returns {Error}
 */
export const getLogOutError = (state: AuthState) => state.error;

/**
 * Returns the sign up error.
 * @function getRegistrationError
 * @param {State} state
 * @returns {Error}
 */
export const getRegistrationError = (state: AuthState) => state.error;

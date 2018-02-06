// import @ngrx
import { Action } from '@ngrx/store';

// import type function
import { type } from '../../shared/ngrx/type';

// import models
import { Eperson } from '../eperson/models/eperson.model';

export const AuthActionTypes = {
  AUTHENTICATE: type('dspace/auth/AUTHENTICATE'),
  AUTHENTICATE_ERROR: type('dspace/auth/AUTHENTICATE_ERROR'),
  AUTHENTICATE_SUCCESS: type('dspace/auth/AUTHENTICATE_SUCCESS'),
  AUTHENTICATED: type('dspace/auth/AUTHENTICATED'),
  AUTHENTICATED_ERROR: type('dspace/auth/AUTHENTICATED_ERROR'),
  AUTHENTICATED_SUCCESS: type('dspace/auth/AUTHENTICATED_SUCCESS'),
  RESET_ERROR: type('dspace/auth/RESET_ERROR'),
  LOG_OUT: type('dspace/auth/LOG_OUT'),
  LOG_OUT_ERROR: type('dspace/auth/LOG_OUT_ERROR'),
  LOG_OUT_SUCCESS: type('dspace/auth/LOG_OUT_SUCCESS'),
  REGISTRATION: type('dspace/auth/REGISTRATION'),
  REGISTRATION_ERROR: type('dspace/auth/REGISTRATION_ERROR'),
  REGISTRATION_SUCCESS: type('dspace/auth/REGISTRATION_SUCCESS')
};

/* tslint:disable:max-classes-per-file */

/**
 * Authenticate.
 * @class AuthenticateAction
 * @implements {Action}
 */
export class AuthenticateAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATE;
  payload: {
    email: string;
    password: string
  };

  constructor(email: string, password: string) {
    this.payload = { email, password };
  }
}

/**
 * Checks if user is authenticated.
 * @class AuthenticatedAction
 * @implements {Action}
 */
export class AuthenticatedAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATED;
  payload: string;

  constructor(token: string) {
    this.payload = token;
  }
}

/**
 * Authenticated check success.
 * @class AuthenticatedSuccessAction
 * @implements {Action}
 */
export class AuthenticatedSuccessAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATED_SUCCESS;
  payload: {
    authenticated: boolean;
    user: Eperson
  };

  constructor(authenticated: boolean, user: Eperson) {
    this.payload = { authenticated, user };
  }
}

/**
 * Authenticated check error.
 * @class AuthenticatedErrorAction
 * @implements {Action}
 */
export class AuthenticatedErrorAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATED_ERROR;
  payload: Error;

  constructor(payload: Error) {
    this.payload = payload ;
  }
}

/**
 * Authentication error.
 * @class AuthenticationErrorAction
 * @implements {Action}
 */
export class AuthenticationErrorAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATE_ERROR;
  payload: Error;

  constructor(payload: Error) {
    this.payload = payload ;
  }
}

/**
 * Authentication success.
 * @class AuthenticationSuccessAction
 * @implements {Action}
 */
export class AuthenticationSuccessAction implements Action {
  public type: string = AuthActionTypes.AUTHENTICATE_SUCCESS;
  payload: Eperson;

  constructor(user: Eperson) {
    this.payload = user;
  }
}

/**
 * Reset error.
 * @class ResetAuthenticationErrorAction
 * @implements {Action}
 */
export class ResetAuthenticationErrorAction implements Action {
  public type: string = AuthActionTypes.RESET_ERROR;
}

/**
 * Sign out.
 * @class LogOutAction
 * @implements {Action}
 */
export class LogOutAction implements Action {
  public type: string = AuthActionTypes.LOG_OUT;
  constructor(public payload?: any) {}
}

/**
 * Sign out error.
 * @class LogOutErrorAction
 * @implements {Action}
 */
export class LogOutErrorAction implements Action {
  public type: string = AuthActionTypes.LOG_OUT_ERROR;
  payload: Error;

  constructor(payload: Error) {
    this.payload = payload ;
  }
}

/**
 * Sign out success.
 * @class LogOutSuccessAction
 * @implements {Action}
 */
export class LogOutSuccessAction implements Action {
  public type: string = AuthActionTypes.LOG_OUT_SUCCESS;
  constructor(public payload?: any) {}
}

/**
 * Sign up.
 * @class RegistrationAction
 * @implements {Action}
 */
export class RegistrationAction implements Action {
  public type: string = AuthActionTypes.REGISTRATION;
  payload: Eperson;

  constructor(user: Eperson) {
    this.payload = user;
  }
}

/**
 * Sign up error.
 * @class RegistrationErrorAction
 * @implements {Action}
 */
export class RegistrationErrorAction implements Action {
  public type: string = AuthActionTypes.REGISTRATION_ERROR;
  payload: Error;

  constructor(payload: Error) {
    this.payload = payload ;
  }
}

/**
 * Sign up success.
 * @class RegistrationSuccessAction
 * @implements {Action}
 */
export class RegistrationSuccessAction implements Action {
  public type: string = AuthActionTypes.REGISTRATION_SUCCESS;
  payload: Eperson;

  constructor(user: Eperson) {
    this.payload = user;
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Actions type.
 * @type {AuthActions}
 */
export type AuthActions
  =
  AuthenticateAction
  | AuthenticatedAction
  | AuthenticatedErrorAction
  | AuthenticatedSuccessAction
  | AuthenticationErrorAction
  | AuthenticationSuccessAction
  | RegistrationAction
  | RegistrationErrorAction
  | RegistrationSuccessAction;

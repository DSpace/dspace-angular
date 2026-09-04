/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../ngrx/type';
import { AuthTokenInfo } from './models/auth-token-info.model';

/**
 * NgRx action type constants for the Multi-Factor Authentication flow.
 *
 * These types follow the DSpace convention of `dspace/auth/ACTION_NAME`
 * and are used to identify MFA-related actions in the store.
 */
export const MfaActionTypes = {
  MFA_REQUIRED: type('dspace/auth/MFA_REQUIRED'),
  MFA_VERIFY: type('dspace/auth/MFA_VERIFY'),
  MFA_VERIFY_SUCCESS: type('dspace/auth/MFA_VERIFY_SUCCESS'),
  MFA_VERIFY_ERROR: type('dspace/auth/MFA_VERIFY_ERROR'),
  MFA_RESET: type('dspace/auth/MFA_RESET'),
};

/**
 * Dispatched when login succeeds but MFA verification is required.
 *
 * This action transitions the authentication state machine into the
 * "MFA pending" state, where the user must provide a TOTP or recovery code.
 */
export class MfaRequiredAction implements Action {
  /** @inheritdoc */
  public type: string = MfaActionTypes.MFA_REQUIRED;

  /**
   * @param payload - The MFA-pending authentication token. This token has limited
   *   privileges and can only be used to call the MFA verify endpoint.
   */
  constructor(public payload: AuthTokenInfo) {}
}

/**
 * Dispatched when user submits a TOTP code or recovery code for MFA verification.
 *
 * Exactly one of `code` or `recoveryCode` should be provided in the payload.
 */
export class MfaVerifyAction implements Action {
  /** @inheritdoc */
  public type: string = MfaActionTypes.MFA_VERIFY;

  /**
   * @param payload - Object containing either a 6-digit TOTP `code` or a `recoveryCode`.
   */
  constructor(public payload: { code?: string; recoveryCode?: string }) {}
}

/**
 * Dispatched when MFA verification succeeds. Contains the new fully-verified token.
 *
 * After this action, the normal `AuthenticationSuccessAction` flow takes over
 * to complete the login process.
 */
export class MfaVerifySuccessAction implements Action {
  /** @inheritdoc */
  public type: string = MfaActionTypes.MFA_VERIFY_SUCCESS;

  /**
   * @param payload - The fully-authenticated token issued after successful MFA verification,
   *   or null if the token is extracted from a response header instead.
   */
  constructor(public payload: AuthTokenInfo) {}
}

/**
 * Dispatched when MFA verification fails (invalid code, expired code, etc.).
 *
 * The error message can be used to display feedback to the user.
 */
export class MfaVerifyErrorAction implements Action {
  /** @inheritdoc */
  public type: string = MfaActionTypes.MFA_VERIFY_ERROR;

  /**
   * @param payload - An error message key or description explaining why verification failed.
   */
  constructor(public payload: string) {}
}

/**
 * Dispatched to clear all MFA-related state (e.g., on logout or user cancellation).
 *
 * This resets the store to its initial state with no pending MFA token or error.
 */
export class MfaResetAction implements Action {
  /** @inheritdoc */
  public type: string = MfaActionTypes.MFA_RESET;
}

/**
 * Union type of all MFA-related actions for use in reducers and effects.
 */
export type MfaActions = MfaRequiredAction | MfaVerifyAction | MfaVerifySuccessAction | MfaVerifyErrorAction | MfaResetAction;

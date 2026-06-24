import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  select,
  Store,
} from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { AuthenticationSuccessAction } from './auth.actions';
import { AuthService } from './auth.service';
import {
  MfaActionTypes,
  MfaVerifyAction,
  MfaVerifyErrorAction,
  MfaVerifySuccessAction,
} from './mfa.actions';
import { MfaService } from './mfa.service';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { getMfaPendingToken } from './selectors';

/**
 * NgRx Effects for the Multi-Factor Authentication flow.
 *
 * Handles side effects triggered by MFA actions, primarily the verification
 * of TOTP codes against the backend MFA endpoint. The flow is:
 *
 * 1. User submits a code -> `MFA_VERIFY` dispatched
 * 2. This effect calls the MFA verify endpoint with the pending token
 * 3. On success, dispatches `AuthenticationSuccessAction` with the new full-access token
 * 4. On failure, dispatches `MfaVerifyErrorAction` with an error message
 */
@Injectable()
export class MfaEffects {
  /**
   * @param actions$ - NgRx actions stream
   * @param mfaService - Service for MFA HTTP calls
   * @param authService - Core authentication service
   * @param store - NgRx store for accessing pending MFA token state
   */
  constructor(
    private actions$: Actions,
    private mfaService: MfaService,
    private authService: AuthService,
    private store: Store,
  ) {}

  /**
   * Effect that handles MFA code verification.
   *
   * When `MFA_VERIFY` is dispatched, this effect:
   * 1. Retrieves the pending MFA token from the store
   * 2. POSTs the TOTP/recovery code to the MFA verify endpoint
   * 3. Extracts the new fully-verified JWT from the response `Authorization` header
   * 4. Dispatches `AuthenticationSuccessAction` on success or `MfaVerifyErrorAction` on failure
   */
  public verify$ = createEffect(() => this.actions$.pipe(
    ofType(MfaActionTypes.MFA_VERIFY),
    withLatestFrom(this.store.pipe(select(getMfaPendingToken))),
    switchMap(([action, pendingToken]: [MfaVerifyAction, AuthTokenInfo]) =>
      this.mfaService.verify(action.payload.code, action.payload.recoveryCode, pendingToken?.accessToken).pipe(
        map((response: HttpResponse<any>) => {
          const authHeader = response.headers?.get('Authorization') || response.headers?.get('authorization');
          if (authHeader) {
            const tokenStr = authHeader.replace('Bearer ', '');
            const newToken = new AuthTokenInfo(tokenStr);
            return new AuthenticationSuccessAction(newToken);
          }
          return new MfaVerifySuccessAction(null);
        }),
        catchError((error: unknown) => {
          const message = error?.error?.error || 'mfa.verify.error';
          return of(new MfaVerifyErrorAction(message));
        }),
      ),
    ),
  ));

  /**
   * Effect that handles post-MFA-verification logic.
   *
   * After `MFA_VERIFY_SUCCESS` is dispatched (fallback path when the token
   * is not in the Authorization header), this triggers a re-check of the
   * authentication token cookie to complete the login flow.
   */
  public verifySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(MfaActionTypes.MFA_VERIFY_SUCCESS),
    map(() => {
      // Trigger re-check of authentication which will pick up the new token
      // from the Authorization response header that was set by the verify endpoint.
      return { type: 'dspace/auth/CHECK_AUTHENTICATION_TOKEN_COOKIE' };
    }),
  ));
}

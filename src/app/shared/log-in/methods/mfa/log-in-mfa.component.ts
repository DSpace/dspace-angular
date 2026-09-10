import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MfaResetAction,
  MfaVerifyAction,
} from '@dspace/core/auth/mfa.actions';
import {
  getMfaError,
  isMfaVerifying,
} from '@dspace/core/auth/selectors';
import { CoreState } from '@dspace/core/core-state.model';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BtnDisabledDirective } from '../../../../shared/btn-disabled.directive';

/**
 * Component shown during the login flow when MFA verification is required.
 *
 * After the user successfully authenticates with username/password and the server
 * indicates MFA is required, this component is displayed to collect a TOTP code
 * or recovery code. It dispatches NgRx actions to trigger the MFA verification
 * effect and displays loading/error state from the store.
 *
 * The component supports two input modes:
 * - **TOTP mode** (default): Accepts a 6-digit code from an authenticator app
 * - **Recovery mode**: Accepts a one-time recovery code for emergency access
 *
 * @example
 * ```html
 * <ds-log-in-mfa></ds-log-in-mfa>
 * ```
 */
@Component({
  selector: 'ds-log-in-mfa',
  templateUrl: './log-in-mfa.component.html',
  styleUrls: ['./log-in-mfa.component.scss'],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class LogInMfaComponent {
  /** Reactive form containing the `code` control for TOTP or recovery code input. */
  form: FormGroup;

  /** Whether the component is currently showing the recovery code input mode. */
  showRecoveryInput = false;

  /** Observable indicating whether MFA verification is in progress. */
  verifying$: Observable<boolean>;

  /** Observable emitting the current MFA error message, or null if none. */
  error$: Observable<string>;

  /**
   * @param store - NgRx store for dispatching MFA actions and selecting state
   * @param fb - Angular FormBuilder for creating reactive forms
   */
  constructor(
    private store: Store<CoreState>,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
    this.verifying$ = this.store.pipe(select(isMfaVerifying));
    this.error$ = this.store.pipe(select(getMfaError));
  }

  /**
   * Submits the MFA verification form.
   *
   * Dispatches a `MfaVerifyAction` with either a TOTP code or recovery code
   * depending on the current input mode. Does nothing if the input is empty.
   */
  submit(): void {
    if (this.showRecoveryInput) {
      const recoveryCode = this.form.get('code').value?.trim();
      if (recoveryCode) {
        this.store.dispatch(new MfaVerifyAction({ recoveryCode }));
      }
    } else {
      const code = this.form.get('code').value?.trim();
      if (code) {
        this.store.dispatch(new MfaVerifyAction({ code }));
      }
    }
  }

  /**
   * Toggles between TOTP code input and recovery code input modes.
   *
   * Resets the form and updates validators accordingly:
   * - TOTP mode requires exactly 6 digits
   * - Recovery mode only requires a non-empty value
   */
  toggleRecovery(): void {
    this.showRecoveryInput = !this.showRecoveryInput;
    this.form.reset();
    if (this.showRecoveryInput) {
      this.form.get('code').setValidators([Validators.required]);
    } else {
      this.form.get('code').setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    }
    this.form.get('code').updateValueAndValidity();
  }

  /**
   * Cancels the MFA verification flow.
   *
   * Dispatches `MfaResetAction` to clear MFA state, returning the user
   * to the initial login screen.
   */
  cancel(): void {
    this.store.dispatch(new MfaResetAction());
  }
}

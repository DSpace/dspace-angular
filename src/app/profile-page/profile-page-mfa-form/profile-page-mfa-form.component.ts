import { AsyncPipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MfaService,
  MfaStatusResponse,
} from '@dspace/core/auth/mfa.service';
import { TranslateModule } from '@ngx-translate/core';
import QRCode from 'qrcode';
import { BehaviorSubject } from 'rxjs';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';

/**
 * Profile page section for managing Multi-Factor Authentication.
 *
 * This component provides the full MFA management UI allowing users to:
 * - View their current MFA status (enabled/disabled, remaining recovery codes)
 * - Set up TOTP-based MFA with QR code scanning
 * - Confirm setup by verifying a code from their authenticator app
 * - Disable MFA (requires current TOTP code)
 * - Regenerate recovery codes (requires current TOTP code)
 *
 * The QR code is rendered to a canvas element using the `qrcode` library
 * and is automatically updated via `ngAfterViewChecked` when the provisioning
 * URI changes.
 *
 * @example
 * ```html
 * <ds-profile-page-mfa-form></ds-profile-page-mfa-form>
 * ```
 */
@Component({
  selector: 'ds-profile-page-mfa-form',
  templateUrl: './profile-page-mfa-form.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ProfilePageMfaFormComponent implements OnInit, AfterViewChecked {
  /** Reference to the canvas element used for rendering the TOTP QR code. */
  @ViewChild('qrCanvas') qrCanvas: ElementRef<HTMLCanvasElement>;

  /** Tracks the last rendered provisioning URI to avoid redundant QR re-renders. */
  private lastRenderedUri: string = null;

  /** Whether MFA is currently enabled for the user. */
  mfaEnabled$ = new BehaviorSubject<boolean>(false);

  /** Number of unused recovery codes remaining. */
  remainingCodes$ = new BehaviorSubject<number>(0);

  /** Whether the component is in MFA setup mode (showing QR code and verification form). */
  setupMode$ = new BehaviorSubject<boolean>(false);

  /** The `otpauth://` provisioning URI for QR code generation, or null if not in setup. */
  provisioningUri$ = new BehaviorSubject<string>(null);

  /** Recovery codes to display to the user after setup or regeneration, or null. */
  recoveryCodes$ = new BehaviorSubject<string[]>(null);

  /** Current error message translation key, or null if no error. */
  error$ = new BehaviorSubject<string>(null);

  /** Whether an async operation is in progress. */
  loading$ = new BehaviorSubject<boolean>(false);

  /** Form for verifying the TOTP code during initial MFA setup. */
  verifyForm: FormGroup;

  /** Form for providing TOTP code when disabling MFA. */
  disableForm: FormGroup;

  /** Form for providing TOTP code when regenerating recovery codes. */
  regenForm: FormGroup;

  /**
   * @param mfaService - Service for MFA HTTP operations
   * @param fb - Angular FormBuilder for creating reactive forms
   */
  constructor(
    private mfaService: MfaService,
    private fb: FormBuilder,
  ) {
    this.verifyForm = this.fb.group({ code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });
    this.disableForm = this.fb.group({ code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });
    this.regenForm = this.fb.group({ code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });
  }

  /** Loads MFA status on component initialization. */
  ngOnInit(): void {
    this.loadStatus();
  }

  /**
   * Fetches the current MFA status from the server and updates local state.
   * Sets `mfaEnabled$` and `remainingCodes$` on success, or `error$` on failure.
   */
  loadStatus(): void {
    this.mfaService.getStatus().subscribe({
      next: (status: MfaStatusResponse) => {
        this.mfaEnabled$.next(status.enabled);
        this.remainingCodes$.next(status.remainingRecoveryCodes);
      },
      error: () => this.error$.next('profile.mfa.error.status'),
    });
  }

  /**
   * Initiates MFA setup by requesting a new TOTP secret from the server.
   * On success, enters setup mode and displays the provisioning URI as a QR code.
   */
  startSetup(): void {
    this.loading$.next(true);
    this.error$.next(null);
    this.mfaService.setup().subscribe({
      next: (response) => {
        this.provisioningUri$.next(response.provisioningUri);
        this.setupMode$.next(true);
        this.loading$.next(false);
      },
      error: (err: unknown) => {
        this.error$.next((err as any)?.error?.error || 'profile.mfa.error.setup');
        this.loading$.next(false);
      },
    });
  }

  /**
   * Confirms MFA setup by verifying the TOTP code entered by the user.
   * On success, activates MFA and displays recovery codes.
   * Does nothing if the code input is empty.
   */
  confirmSetup(): void {
    const code = this.verifyForm.get('code').value?.trim();
    if (!code) { return; }
    this.loading$.next(true);
    this.error$.next(null);
    this.mfaService.verifySetup(code).subscribe({
      next: (response) => {
        this.recoveryCodes$.next(response.recoveryCodes);
        this.mfaEnabled$.next(true);
        this.setupMode$.next(false);
        this.loading$.next(false);
        this.verifyForm.reset();
      },
      error: (err: unknown) => {
        this.error$.next((err as any)?.error?.error || 'profile.mfa.error.verify');
        this.loading$.next(false);
      },
    });
  }

  /**
   * Disables MFA for the user after verifying their TOTP code.
   * Resets all MFA-related state on success.
   * Does nothing if the code input is empty.
   */
  disable(): void {
    const code = this.disableForm.get('code').value?.trim();
    if (!code) { return; }
    this.loading$.next(true);
    this.error$.next(null);
    this.mfaService.disable(code).subscribe({
      next: () => {
        this.mfaEnabled$.next(false);
        this.remainingCodes$.next(0);
        this.recoveryCodes$.next(null);
        this.loading$.next(false);
        this.disableForm.reset();
      },
      error: (err: unknown) => {
        this.error$.next((err as any)?.error?.error || 'profile.mfa.error.disable');
        this.loading$.next(false);
      },
    });
  }

  /**
   * Regenerates recovery codes after verifying the user's TOTP code.
   * Invalidates all previously issued codes and displays new ones.
   * Does nothing if the code input is empty.
   */
  regenerateCodes(): void {
    const code = this.regenForm.get('code').value?.trim();
    if (!code) { return; }
    this.loading$.next(true);
    this.error$.next(null);
    this.mfaService.regenerateRecoveryCodes(code).subscribe({
      next: (response) => {
        this.recoveryCodes$.next(response.recoveryCodes);
        this.remainingCodes$.next(response.recoveryCodes.length);
        this.loading$.next(false);
        this.regenForm.reset();
      },
      error: (err: unknown) => {
        this.error$.next((err as any)?.error?.error || 'profile.mfa.error.regenerate');
        this.loading$.next(false);
      },
    });
  }

  /**
   * Dismisses the displayed recovery codes and refreshes MFA status.
   */
  dismissCodes(): void {
    this.recoveryCodes$.next(null);
    this.loadStatus();
  }

  /**
   * Cancels the MFA setup flow and resets setup-related state.
   */
  cancelSetup(): void {
    this.setupMode$.next(false);
    this.provisioningUri$.next(null);
    this.lastRenderedUri = null;
    this.verifyForm.reset();
  }

  /**
   * Renders the QR code to the canvas element when the provisioning URI changes.
   * Uses `lastRenderedUri` to avoid redundant re-renders on each change detection cycle.
   */
  ngAfterViewChecked(): void {
    const uri = this.provisioningUri$.value;
    if (this.qrCanvas?.nativeElement && uri && uri !== this.lastRenderedUri) {
      this.lastRenderedUri = uri;
      QRCode.toCanvas(this.qrCanvas.nativeElement, uri, { width: 200 });
    }
  }
}

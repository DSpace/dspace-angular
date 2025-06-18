import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';
import {
  combineLatest,
  Subscription,
  take,
} from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { HardRedirectService } from '../../../core/services/hard-redirect.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { Registration } from '../../../core/shared/registration.model';
import {
  hasNoValue,
  hasValue,
} from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ExternalLoginService } from '../../services/external-login.service';

@Component({
  selector: 'ds-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
  ],
})
/**
 * Email confirmation component that will check for user email confirmation after account creation.
 */
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  /**
   * The form containing the email input
   */
  emailForm: FormGroup;
  /**
   * The registration data object
   */
  @Input() registrationData: Registration;

  /**
   * The token to be used to confirm the registration
   */
  @Input() token: string;
  /**
   * The subscriptions to unsubscribe from
   */
  subs: Subscription[] = [];

  externalLocation: string;

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private formBuilder: FormBuilder,
    private externalLoginService: ExternalLoginService,
    private epersonDataService: EPersonDataService,
    private notificationService: NotificationsService,
    private translate: TranslateService,
    private authService: AuthService,
    private hardRedirectService: HardRedirectService,
  ) {
  }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: [this.registrationData.email, [Validators.required, Validators.email]],
    });
  }


  /**
   * Submits the email form and performs appropriate actions based on the form's validity and user input.
   * If the form is valid and the confirmed email matches the registration email, calls the postCreateAccountFromToken method with the token and registration data.
   * If the form is valid but the confirmed email does not match the registration email, calls the patchUpdateRegistration method with the confirmed email.
   */
  submitForm() {
    this.emailForm.markAllAsTouched();
    if (this.emailForm.valid) {
      const confirmedEmail = this.emailForm.get('email').value;
      if (confirmedEmail && isEqual(this.registrationData.email, confirmedEmail.trim())) {
        this.postCreateAccountFromToken(this.token, this.registrationData);
      } else {
        this.patchUpdateRegistration([confirmedEmail]);
      }
    }
  }

  /**
   * Sends a PATCH request to update the user's registration with the given values.
   * @param values - The values to update the user's registration with.
   * @returns An Observable that emits the updated registration data.
   */
  private patchUpdateRegistration(values: string[]) {
    this.subs.push(
      this.externalLoginService.patchUpdateRegistration(values, 'email', this.registrationData.id, this.token, 'replace')
        .pipe(getRemoteDataPayload())
        .subscribe());
  }

  /**
    * Creates a new user from a given token and registration data.
    * Based on the registration data, the user will be created with the following properties:
    * - email: the email address from the registration data
    * - metadata: all metadata values from the registration data, except for the email metadata key (ePerson object does not have an email metadata field)
    * - canLogIn: true
    * - requireCertificate: false
    * @param token The token used to create the user.
    * @param registrationData The registration data used to create the user.
    * @returns An Observable that emits a boolean indicating whether the user creation was successful.
    */
  private postCreateAccountFromToken(
    token: string,
    registrationData: Registration,
  ) {
    // check if the netId is present
    // in order to create an account, the netId is required (since the user is created without a password)
    if (hasNoValue(this.registrationData.netId)) {
      this.notificationService.error(this.translate.get('external-login-page.confirm-email.create-account.notifications.error.no-netId'));
      return;
    }

    const metadataValues = {};
    for (const [key, value] of Object.entries(registrationData.registrationMetadata)) {
      // exclude the email metadata key, since the ePerson object does not have an email metadata field
      if (hasValue(value[0]?.value) && key !== 'email') {
        metadataValues[key] = value;
      }
    }
    const eperson = new EPerson();
    eperson.email = registrationData.email;
    eperson.netid = registrationData.netId;
    eperson.metadata = metadataValues;
    eperson.canLogIn = true;
    eperson.requireCertificate = false;
    eperson.selfRegistered = true;
    this.subs.push(
      combineLatest([
        this.epersonDataService.createEPersonForToken(eperson, token).pipe(
          getFirstCompletedRemoteData(),
        ),
        this.externalLoginService.getExternalAuthLocation(this.registrationData.registrationType),
        this.authService.getRedirectUrl().pipe(take(1)),
      ])
        .subscribe(([rd, location, redirectRoute]) => {
          if (rd.hasFailed) {
            this.notificationService.error(
              this.translate.get('external-login-page.provide-email.create-account.notifications.error.header'),
              this.translate.get('external-login-page.provide-email.create-account.notifications.error.content'),
            );
          } else if (rd.hasSucceeded) {
            // set Redirect URL to User profile, so the user is redirected to the profile page after logging in
            this.authService.setRedirectUrl('/profile');
            const externalServerUrl = this.authService.getExternalServerRedirectUrl(
              this._window.nativeWindow.origin,
              redirectRoute,
              location,
            );
            // redirect to external registration type authentication url
            this.hardRedirectService.redirect(externalServerUrl);
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.filter(sub => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}

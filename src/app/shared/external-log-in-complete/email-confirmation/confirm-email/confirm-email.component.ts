import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalLoginService } from '../../services/external-login.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../core/shared/operators';
import { RegistrationData } from '../../models/registration-data.model';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { hasValue } from '../../../../shared/empty.util';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ds-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEmailComponent implements OnDestroy {

  emailForm: FormGroup;

  @Input() registrationData: RegistrationData;

  @Input() token: string;

  subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private externalLoginService: ExternalLoginService,
    private epersonDataService: EPersonDataService,
    private notificationService: NotificationsService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    this.emailForm.markAllAsTouched();
    this.router.navigate(['/login'], { queryParams: { authMethod: this.registrationData.registrationType } });

    if (this.emailForm.valid) {
      const confirmedEmail = this.emailForm.get('email').value;
      if (confirmedEmail && isEqual(this.registrationData.email, confirmedEmail.trim())) {
        this.postCreateAccountFromToken(this.token, this.registrationData);
      } else {
        this.patchUpdateRegistration([confirmedEmail]);
      }
    }
  }

  private patchUpdateRegistration(values: string[]) {
    this.subs.push(
      this.externalLoginService.patchUpdateRegistration(values, 'email', this.registrationData.id, this.token, 'replace')
        .pipe(getRemoteDataPayload())
        .subscribe((update) => {
          // TODO: remove this line (temporary)
          console.log('Email update:', update);
        }));
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
    registrationData: RegistrationData
  ) {
    const metadataValues = {};
    for (const [key, value] of Object.entries(registrationData.registrationMetadata)) {
      if (hasValue(value[0]?.value) && key !== 'email') {
        metadataValues[key] = value[0];
      }
    }
    const eperson = new EPerson();
    eperson.email = registrationData.email;
    eperson.metadata = metadataValues;
    eperson.canLogIn = true;
    eperson.requireCertificate = false;
    this.subs.push(
      this.epersonDataService.createEPersonForToken(eperson, token).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((rd: RemoteData<EPerson>) => {
        if (rd.hasFailed) {
          this.notificationService.error(
            this.translate.get('external-login-page.provide-email.create-account.notifications.error.header'),
            this.translate.get('external-login-page.provide-email.create-account.notifications.error.content')
          );
        } else if (rd.hasSucceeded) {
          // TODO: redirect to ORCID login page
          // set Redirect URL to User profile
          this.router.navigate(['/login'], { queryParams: { authMethod: registrationData.registrationType } });
          this.authService.setRedirectUrl('/review-account');
        }
      }));
  }

  ngOnDestroy(): void {
    this.subs.filter(sub => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}

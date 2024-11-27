import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { LangConfig } from '../../../config/lang-config.interface';
import { environment } from '../../../environments/environment';
import { AuthenticateAction } from '../../core/auth/auth.actions';
import { CoreState } from '../../core/core-state.model';
import { RemoteData } from '../../core/data/remote-data';
import {
  END_USER_AGREEMENT_METADATA_FIELD,
  EndUserAgreementService,
} from '../../core/end-user-agreement/end-user-agreement.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { ProfilePageSecurityFormComponent } from '../../profile-page/profile-page-security-form/profile-page-security-form.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { isEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';

/**
 * Component that renders the create profile page to be used by a user registering through a token
 */
@Component({
  selector: 'ds-base-create-profile',
  styleUrls: ['./create-profile.component.scss'],
  templateUrl: './create-profile.component.html',
  imports: [
    ProfilePageSecurityFormComponent,
    TranslateModule,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    AlertComponent,
    RouterLink,
  ],
  standalone: true,
})
export class CreateProfileComponent implements OnInit {
  registration$: Observable<Registration>;

  email: string;
  token: string;
  hasGroups = false;
  isInValidPassword = true;
  password: string;

  userInfoForm: UntypedFormGroup;
  activeLangs: LangConfig[];

  /**
   * Prefix for the notification messages of this security form
   */
  NOTIFICATIONS_PREFIX = 'register-page.create-profile.submit.';

  constructor(
    private translateService: TranslateService,
    private ePersonDataService: EPersonDataService,
    private store: Store<CoreState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private notificationsService: NotificationsService,
    private endUserAgreementService: EndUserAgreementService,
  ) {

  }

  ngOnInit(): void {
    this.registration$ = this.route.data.pipe(
      map((data) => data.registration as RemoteData<Registration>),
      getFirstSucceededRemoteDataPayload(),
    );
    this.registration$.pipe(take(1))
      .subscribe((registration: Registration) => {
        if (registration.groupNames && registration.groupNames.length > 0) {
          this.hasGroups = true;
        }
        this.email = registration.email;
        this.token = registration.token;
      });
    this.activeLangs = environment.languages.filter((MyLangConfig) => MyLangConfig.active === true);

    this.userInfoForm = this.formBuilder.group({
      firstName: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      lastName: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      contactPhone: new UntypedFormControl(''),
      language: new UntypedFormControl(''),
      userAgreementAccept: new UntypedFormControl(false, {
        validators: [Validators.requiredTrue],
      }),
    });

  }

  /**
   * Sets the validity of the password based on a value emitted from the form
   * @param $event
   */
  setInValid($event: boolean) {
    this.isInValidPassword = $event || isEmpty(this.password);
  }

  /**
   * Sets the value of the password based on a value emitted from the form
   * @param $event
   */
  setPasswordValue($event: string) {
    this.password = $event;
    this.isInValidPassword = this.isInValidPassword || isEmpty(this.password);
  }

  get firstName() {
    return this.userInfoForm.get('firstName');
  }

  get lastName() {
    return this.userInfoForm.get('lastName');
  }

  get contactPhone() {
    return this.userInfoForm.get('contactPhone');
  }

  get language() {
    return this.userInfoForm.get('language');
  }

  get userAgreementAccept() {
    return this.userInfoForm.get('userAgreementAccept');
  }

  /**
   * Submits the eperson to the service to be created.
   * The submission will not be made when the form or the password is not valid.
   */
  submitEperson() {
    if (!(this.userInfoForm.invalid || this.isInValidPassword)) {
      const values = {
        metadata: {
          'eperson.firstname': [
            {
              value: this.firstName.value,
            },
          ],
          'eperson.lastname': [
            {
              value: this.lastName.value,
            },
          ],
          'eperson.phone': [
            {
              value: this.contactPhone.value,
            },
          ],
          'eperson.language': [
            {
              value: this.language.value,
            },
          ],
        },
        email: this.email,
        password: this.password,
        canLogIn: true,
        requireCertificate: false,
      };

      // If the End User Agreement cookie is accepted, add end-user agreement metadata to the user
      this.endUserAgreementService.isUserAgreementEnabled().pipe(
        map((isUserAgreementEnabled: boolean) => {
          if (isUserAgreementEnabled && this.userAgreementAccept) {
            values.metadata[END_USER_AGREEMENT_METADATA_FIELD] = [
              {
                value: String(true),
              },
            ];
            this.endUserAgreementService.removeCookieAccepted();
          }

          return Object.assign(new EPerson(), values);
        }),
        switchMap((eperson: EPerson) => {
          return this.ePersonDataService.createEPersonForToken(eperson, this.token).pipe(
            getFirstCompletedRemoteData(),
          );
        }),
      ).subscribe((rd: RemoteData<EPerson>) => {
        if (rd.hasSucceeded) {
          this.notificationsService.success(this.translateService.get(this.NOTIFICATIONS_PREFIX + 'success.head'),
            this.translateService.get(this.NOTIFICATIONS_PREFIX + 'success.content'));
          this.store.dispatch(new AuthenticateAction(this.email, this.password));
          this.router.navigate(['/home']);
        } else {
          this.notificationsService.error(this.translateService.get(this.NOTIFICATIONS_PREFIX + 'error.head'), rd.errorMessage);
        }
      });
    }
  }

  /**
   * Redirect to the invitation page
   */
  redirectToInvitationPage(): void {
    this.registration$.pipe(take(1)).subscribe((registration: Registration) => {
      this.router.navigate(['invitation', registration.token]);
    });
  }
}

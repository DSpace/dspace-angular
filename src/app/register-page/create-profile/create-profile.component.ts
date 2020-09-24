import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Registration } from '../../core/shared/registration.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { LangConfig } from '../../../config/lang-config.interface';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { AuthenticateAction } from '../../core/auth/auth.actions';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { environment } from '../../../environments/environment';
import { isEmpty } from '../../shared/empty.util';
import {
  END_USER_AGREEMENT_METADATA_FIELD,
  EndUserAgreementService
} from '../../core/end-user-agreement/end-user-agreement.service';

/**
 * Component that renders the create profile page to be used by a user registering through a token
 */
@Component({
  selector: 'ds-create-profile',
  templateUrl: './create-profile.component.html'
})
export class CreateProfileComponent implements OnInit {
  registration$: Observable<Registration>;

  email: string;
  token: string;

  isInValidPassword = true;
  password: string;

  userInfoForm: FormGroup;
  activeLangs: LangConfig[];

  constructor(
    private translateService: TranslateService,
    private ePersonDataService: EPersonDataService,
    private store: Store<CoreState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private endUserAgreementService: EndUserAgreementService
  ) {

  }

  ngOnInit(): void {
    this.registration$ = this.route.data.pipe(
      map((data) => data.registration as Registration),
    );
    this.registration$.subscribe((registration: Registration) => {
      this.email = registration.email;
      this.token = registration.token;
    });
    this.activeLangs = environment.languages.filter((MyLangConfig) => MyLangConfig.active === true);

    this.userInfoForm = this.formBuilder.group({
      firstName: new FormControl('', {
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
      }),
      contactPhone: new FormControl(''),
      language: new FormControl(''),
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
              value: this.firstName.value
            }
          ],
          'eperson.lastname': [
            {
              value: this.lastName.value
            },
          ],
          'eperson.phone': [
            {
              value: this.contactPhone.value
            }
          ],
          'eperson.language': [
            {
              value: this.language.value
            }
          ]
        },
        email: this.email,
        password: this.password,
        canLogIn: true,
        requireCertificate: false
      };

      // If the End User Agreement cookie is accepted, add end-user agreement metadata to the user
      if (this.endUserAgreementService.isCookieAccepted()) {
        values.metadata[END_USER_AGREEMENT_METADATA_FIELD] = [
          {
            value: String(true)
          }
        ];
        this.endUserAgreementService.removeCookieAccepted();
      }

      const eperson = Object.assign(new EPerson(), values);
      this.ePersonDataService.createEPersonForToken(eperson, this.token).subscribe((response) => {
        if (response.isSuccessful) {
          this.notificationsService.success(this.translateService.get('register-page.create-profile.submit.success.head'),
            this.translateService.get('register-page.create-profile.submit.success.content'));
          this.store.dispatch(new AuthenticateAction(this.email, this.password));
          this.router.navigate(['/home']);
        } else {
          this.notificationsService.error(this.translateService.get('register-page.create-profile.submit.error.head'),
            this.translateService.get('register-page.create-profile.submit.error.content'));
        }
      });
    }
  }

}

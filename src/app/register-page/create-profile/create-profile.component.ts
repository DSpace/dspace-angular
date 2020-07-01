import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map } from 'rxjs/operators';
import { Registration } from '../../core/shared/registration.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from './confirmed.validator';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { LangConfig } from '../../../config/lang-config.interface';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { AuthenticateAction } from '../../core/auth/auth.actions';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { environment } from '../../../environments/environment';

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

  userInfoForm: FormGroup;
  passwordForm: FormGroup;
  activeLangs: LangConfig[];

  isValidPassWord$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    private ePersonDataService: EPersonDataService,
    private store: Store<CoreState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService
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

    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'change'
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });

    this.isValidPassWord$ = this.passwordForm.statusChanges.pipe(
      debounceTime(300),
      map((status: string) => {
        if (status === 'VALID') {
          return true;
        } else {
          return false;
        }
      })
    );
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

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  /**
   * Submits the eperson to the service to be created.
   * The submission will not be made when the form is not valid.
   */
  submitEperson() {
    if (!(this.userInfoForm.invalid || this.passwordForm.invalid)) {
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
        password: this.password.value,
        canLogIn: true,
        requireCertificate: false
      };

      const eperson = Object.assign(new EPerson(), values);
      this.ePersonDataService.createEPersonForToken(eperson, this.token).subscribe((response) => {
        if (response.isSuccessful) {
          this.notificationsService.success(this.translateService.get('register-page.create-profile.submit.success.head'),
            this.translateService.get('register-page.create-profile.submit.success.content'));
          this.store.dispatch(new AuthenticateAction(this.email, this.password.value));
          this.router.navigate(['/home']);
        } else {
          this.notificationsService.error(this.translateService.get('register-page.create-profile.submit.error.head'),
            this.translateService.get('register-page.create-profile.submit.error.content'));
        }
      });

    }
  }
}

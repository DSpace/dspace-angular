import { Component, Input, OnInit } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Registration } from '../core/shared/registration.model';
import { RemoteData } from '../core/data/remote-data';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { isNotEmpty } from '../shared/empty.util';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleRecaptchaService } from '../core/google-recaptcha/google-recaptcha.service';

@Component({
  selector: 'ds-register-email-form',
  templateUrl: './register-email-form.component.html'
})
/**
 * Component responsible to render an email registration form.
 */
export class RegisterEmailFormComponent implements OnInit {

  /**
   * The form containing the mail address
   */
  form: FormGroup;

  /**
   * The message prefix
   */
  @Input()
  MESSAGE_PREFIX: string;

  /**
   * registration verification configuration
   */
  registrationVerification = false;

  captchaVersion(): Observable<string> {
    return this.googleRecaptchaService.captchaVersion();
  }

  captchaMode(): Observable<string> {
    return this.googleRecaptchaService.captchaMode();
  }


constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private configService: ConfigurationDataService,
    public googleRecaptchaService: GoogleRecaptchaService
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        validators: [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ],
      })
    });
    this.configService.findByPropertyName('registration.verification.enabled').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((res: ConfigurationProperty) => res?.values[0].toLowerCase() === 'true')
    ).subscribe((res: boolean) => {
      this.registrationVerification = res;
    });
  }

  /**
   * execute the captcha function for v2 invisible
   */
  executeRecaptcha() {
    console.log('executeRecaptcha');
    this.googleRecaptchaService.executeRecaptcha();
  }

  /**
   * Register an email address
   */
  register(tokenV2 = null) {
    if (!this.form.invalid) {
      if (this.registrationVerification) {
        combineLatest([this.captchaVersion(), this.captchaMode()]).pipe(
          switchMap(([captchaVersion, captchaMode])  => {
            if (captchaVersion === 'v3') {
              return this.googleRecaptchaService.getRecaptchaToken('register_email');
            } else if (captchaMode === 'checkbox') {
              return this.googleRecaptchaService.getRecaptchaTokenResponse();
            } else {
              return of(tokenV2);
            }
          }),
        ).subscribe((token) => {
            if (isNotEmpty(token)) {
              this.registration(token);
            } else {
              this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
                this.translateService.get(`${this.MESSAGE_PREFIX}.error.recaptcha`));
            }
          }
        );
      } else {
        this.registration();
      }
    }
  }

  /**
   * Registration of an email address
   */
  registration(captchaToken = null) {
    let registerEmail$ = captchaToken ?
      this.epersonRegistrationService.registerEmail(this.email.value, captchaToken) :
      this.epersonRegistrationService.registerEmail(this.email.value);
    registerEmail$.subscribe((response: RemoteData<Registration>) => {
      if (response.hasSucceeded) {
        this.notificationService.success(this.translateService.get(`${this.MESSAGE_PREFIX}.success.head`),
          this.translateService.get(`${this.MESSAGE_PREFIX}.success.content`, {email: this.email.value}));
        this.router.navigate(['/home']);
      } else {
        this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
          this.translateService.get(`${this.MESSAGE_PREFIX}.error.content`, {email: this.email.value}));
      }
    });
  }

  get email() {
    return this.form.get('email');
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Registration } from '../core/shared/registration.model';
import { RemoteData } from '../core/data/remote-data';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { isNotEmpty } from '../shared/empty.util';
import { map } from 'rxjs/operators';
import { GoogleRecaptchaService } from '../core/google-recaptcha/google-recaptcha.service';
import { Observable } from 'rxjs';

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

  recaptchaKey$: Observable<any>;

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
    this.recaptchaKey$ = this.configService.findByPropertyName('google.recaptcha.key.site').pipe(
      getFirstSucceededRemoteDataPayload(),
    );
    this.configService.findByPropertyName('registration.verification.enabled').pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0].toLowerCase() === 'true';
      })
    ).subscribe((res: boolean) => {
      this.registrationVerification = res;
    });
  }

  /**
   * execute the captcha function for v2 invisible
   */
  async executeRecaptcha() {
    await this.googleRecaptchaService.executeRecaptcha();
  }

  /**
   * Register an email address
   */
  async register(tokenV2 = null) {
    if (!this.form.invalid) {
      if (this.registrationVerification) {
        let token;
        let captchaVersion;
        let captchaMode;
        this.googleRecaptchaService.captchaVersion$.subscribe(res => {
          captchaVersion = res;
        });
        this.googleRecaptchaService.captchaMode$.subscribe(res => {
          captchaMode = res;
        });
        if (captchaVersion === 'v3') {
          token = await this.googleRecaptchaService.getRecaptchaToken('register_email');
        } else if (captchaMode === 'checkbox') {
          token = await this.googleRecaptchaService.getRecaptchaTokenResponse();
        } else {
          token = tokenV2;
        }
        if (isNotEmpty(token)) {
          this.registration(token);
        } else {
          this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
          this.translateService.get(`${this.MESSAGE_PREFIX}.error.recaptcha`, {email: this.email.value}));
        }
      } else {
        this.registration();
      }
    }
  }

  /**
   * Registration of an email address
   */
  registration(captchaToken = null) {
    let registerEmail$;
    if (captchaToken) {
      registerEmail$ = this.epersonRegistrationService.registerEmail(this.email.value, captchaToken);
    } else {
      registerEmail$ = this.epersonRegistrationService.registerEmail(this.email.value);
    }
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

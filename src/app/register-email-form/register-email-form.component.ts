import { Component, Input, OnInit } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Registration } from '../core/shared/registration.model';
import { RemoteData } from '../core/data/remote-data';
import { GoogleRecaptchaService } from '../core/data/google-recaptcha.service';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { isNotEmpty } from '../shared/empty.util';
import { map } from 'rxjs/operators';

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

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private configService: ConfigurationDataService,
    private googleRecaptchaService: GoogleRecaptchaService
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
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0].toLowerCase() === 'true';
      })
    ).subscribe((res: boolean) => {
      this.registrationVerification = res;
    });
  }

  /**
   * Register an email address
   */
  register() {
    if (!this.form.invalid) {
      if (this.registrationVerification) {
        this.googleRecaptchaService.getRecaptchaToken('register_email').subscribe(res => {
          if (isNotEmpty(res)) {
            this.registeration(res);
          } else {
            this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
            this.translateService.get(`${this.MESSAGE_PREFIX}.error.recaptcha`, {email: this.email.value}));
          }
        });
      } else {
        this.registeration(null);
      }
    }
  }

  /**
   * Register an email address
   */
   registeration(captchaToken) {
    this.epersonRegistrationService.registerEmail(this.email.value, captchaToken).subscribe((response: RemoteData<Registration>) => {
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

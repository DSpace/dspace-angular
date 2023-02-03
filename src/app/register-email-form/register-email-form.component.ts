import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {EpersonRegistrationService} from '../core/data/eperson-registration.service';
import {NotificationsService} from '../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import {Registration} from '../core/shared/registration.model';
import {RemoteData} from '../core/data/remote-data';
import {ConfigurationDataService} from '../core/data/configuration-data.service';
import { getAllSucceededRemoteDataPayload } from '../core/shared/operators';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { Subscription } from 'rxjs';

export const TYPE_REQUEST_FORGOT = 'forgot';
export const TYPE_REQUEST_REGISTER = 'register';

@Component({
  selector: 'ds-register-email-form',
  templateUrl: './register-email-form.component.html'
})
/**
 * Component responsible to render an email registration form.
 */
export class RegisterEmailFormComponent implements OnDestroy, OnInit {

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
   * Type of register request to be done, register new email or forgot password (same endpoint)
   */
  @Input()
  typeRequest: string = null;

  validMailDomains: string[];
  TYPE_REQUEST_REGISTER = TYPE_REQUEST_REGISTER;

  subscriptions: Subscription[] = [];

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationDataService
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    const validators: ValidatorFn[] = [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
    ];
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        validators: validators,
      })
    });
    this.validMailDomains = [];
    if (this.typeRequest === TYPE_REQUEST_REGISTER) {
      this.subscriptions.push(this.configurationService.findByPropertyName('authentication-password.domain.valid')
        .pipe(getAllSucceededRemoteDataPayload())
        .subscribe((configurationProperty: ConfigurationProperty) => {
          for (const remoteValue of configurationProperty.values) {
            this.validMailDomains.push(remoteValue);
            if (this.validMailDomains.length !== 0) {
              this.form.get('email').setValidators([
                ...validators,
                Validators.pattern(this.validMailDomains.map((domain: string) => '(^.*' + domain.replace(new RegExp('\\.', 'g'), '\\.') + '$)').join('|')),
              ]);
              this.form.updateValueAndValidity();
            }
          }
        }));
    }
  }

  /**
   * Register an email address
   */
  register() {
    if (!this.form.invalid) {
      this.subscriptions.push(this.epersonRegistrationService.registerEmail(this.email.value, this.typeRequest).subscribe((response: RemoteData<Registration>) => {
        if (response.hasSucceeded) {
          this.notificationService.success(this.translateService.get(`${this.MESSAGE_PREFIX}.success.head`),
            this.translateService.get(`${this.MESSAGE_PREFIX}.success.content`, {email: this.email.value}));
          this.router.navigate(['/home']);
        } else if (response.statusCode === 422) {
          this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`), this.translateService.get(`${this.MESSAGE_PREFIX}.error.maildomain`, { domains: this.validMailDomains.join(', ')}));
        } else {
          this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
            this.translateService.get(`${this.MESSAGE_PREFIX}.error.content`, {email: this.email.value}));
          this.notificationService.error('title', response.errorMessage);
        }
        }
      ));
    }
  }

  get email() {
    return this.form.get('email');
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { RestResponse } from '../core/cache/response.models';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder
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

  }

  /**
   * Register an email address
   */
  register() {
    if (!this.form.invalid) {
      this.epersonRegistrationService.registerEmail(this.email.value).subscribe((response: RestResponse) => {
          if (response.isSuccessful) {
            this.notificationService.success(this.translateService.get(`${this.MESSAGE_PREFIX}.success.head`),
              this.translateService.get(`${this.MESSAGE_PREFIX}.success.content`, {email: this.email.value}));
            this.router.navigate(['/home']);
          } else {
            this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
              this.translateService.get(`${this.MESSAGE_PREFIX}.error.content`, {email: this.email.value}));
          }
        }
      );
    }
  }

  get email() {
    return this.form.get('email');
  }

}

import { Component, Input, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ErrorResponse, RestResponse } from '../../core/cache/response.models';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-profile-page-security-form',
  templateUrl: './profile-page-security-form.component.html'
})
/**
 * Component for a user to edit their security information
 * Displays a form containing a password field and a confirmation of the password
 */
export class ProfilePageSecurityFormComponent implements OnInit {
  /**
   * The user to display the form for
   */
  @Input() user: EPerson;

  /**
   * The form's input models
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'password',
      name: 'password',
      inputType: 'password'
    }),
    new DynamicInputModel({
      id: 'passwordrepeat',
      name: 'passwordrepeat',
      inputType: 'password'
    })
  ];

  /**
   * The form group of this form
   */
  formGroup: FormGroup;

  /**
   * Prefix for the notification messages of this component
   */
  NOTIFICATIONS_PREFIX = 'profile.security.form.notifications.';

  /**
   * Prefix for the form's label messages of this component
   */
  LABEL_PREFIX = 'profile.security.form.label.';

  constructor(protected formService: DynamicFormService,
              protected translate: TranslateService,
              protected epersonService: EPersonDataService,
              protected notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel, { validators: [this.checkPasswordsEqual, this.checkPasswordLength] });
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  /**
   * Update the translations of the field labels
   */
  updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.LABEL_PREFIX + fieldModel.id);
      }
    );
  }

  /**
   * Check if both password fields are filled in and equal
   * @param group The FormGroup to validate
   */
  checkPasswordsEqual(group: FormGroup) {
    const pass = group.get('password').value;
    const repeatPass = group.get('passwordrepeat').value;

    return pass === repeatPass ? null : { notSame: true };
  }

  /**
   * Check if the password is at least 6 characters long
   * @param group The FormGroup to validate
   */
  checkPasswordLength(group: FormGroup) {
    const pass = group.get('password').value;

    return isEmpty(pass) || pass.length >= 6 ? null : { notLongEnough: true };
  }

  /**
   * Update the user's security details
   *
   * Sends a patch request for changing the user's password when a new password is present and the password confirmation
   * matches the new password.
   * Nothing happens when no passwords are filled in.
   * An error notification is displayed when the password confirmation does not match the new password.
   *
   * Returns false when nothing happened
   */
  updateSecurity() {
    const pass = this.formGroup.get('password').value;
    const passEntered = isNotEmpty(pass);
    if (!this.formGroup.valid) {
      if (passEntered) {
        if (this.checkPasswordsEqual(this.formGroup) != null) {
          this.notificationsService.error(this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.not-same'));
        }
        if (this.checkPasswordLength(this.formGroup) != null) {
          this.notificationsService.error(this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.not-long-enough'));
        }
        return true;
      }
      return false;
    }
    if (passEntered) {
      const operation = Object.assign({ op: 'replace', path: '/password', value: pass });
      this.epersonService.patch(this.user, [operation]).subscribe((response: RestResponse) => {
        if (response.isSuccessful) {
          this.notificationsService.success(
            this.translate.instant(this.NOTIFICATIONS_PREFIX + 'success.title'),
            this.translate.instant(this.NOTIFICATIONS_PREFIX + 'success.content')
          );
        } else {
          this.notificationsService.error(
            this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.title'), (response as ErrorResponse).errorMessage
          );
        }
      });

    }

    return passEntered;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService, DynamicFormValueControlModel,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ErrorResponse, RestResponse } from '../../core/cache/response.models';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-profile-page-security-form',
  templateUrl: './profile-page-security-form.component.html'
})
export class ProfilePageSecurityFormComponent implements OnInit {
  /**
   * The user to display the form for
   */
  @Input() user: EPerson;

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

  NOTIFICATIONS_PREFIX = 'profile.security.form.notifications.';

  LABEL_PREFIX = 'profile.security.form.label.';

  constructor(protected formService: DynamicFormService,
              protected translate: TranslateService,
              protected epersonService: EPersonDataService,
              protected notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel, { validators: this.checkPasswords });
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.LABEL_PREFIX + fieldModel.id);
      }
    );
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const repeatPass = group.get('passwordrepeat').value;

    return isEmpty(repeatPass) || pass === repeatPass ? null : { notSame: true };
  }

  updateSecurity() {
    const pass = this.formGroup.get('password').value;
    const passEntered = isNotEmpty(pass);
    if (!this.formGroup.valid) {
      if (passEntered) {
        this.notificationsService.error(this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.not-same'));
        return true;
      }
      return false;
    }
    if (passEntered) {
      const operation = Object.assign({ op: 'replace', path: '/password', value: pass });
      this.epersonService.immediatePatch(this.user, [operation]).subscribe((response: RestResponse) => {
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

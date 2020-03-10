import { Component, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ds-profile-page-security-form',
  templateUrl: './profile-page-security-form.component.html'
})
export class ProfilePageSecurityFormComponent implements OnInit {

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

  LABEL_PREFIX = 'profile.security.form.label.';

  constructor(protected formService: DynamicFormService,
              protected translate: TranslateService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);
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
}

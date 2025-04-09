import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { debounceTimeWorkaround as debounceTime } from '../../core/shared/operators';
import { AlertComponent } from '../../shared/alert/alert.component';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
import { FormComponent } from '../../shared/form/form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-profile-page-security-form',
  templateUrl: './profile-page-security-form.component.html',
  imports: [
    NgIf,
    FormComponent,
    AlertComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component for a user to edit their security information
 * Displays a form containing a password field and a confirmation of the password
 */
export class ProfilePageSecurityFormComponent implements OnInit {

  /**
   * Emits the validity of the password
   */
  @Output() isInvalid = new EventEmitter<boolean>();
  /**
   * Emits the value of the password
   */
  @Output() passwordValue = new EventEmitter<string>();
  /**
   * Emits the value of the current-password
   */
  @Output() currentPasswordValue = new EventEmitter<string>();

  /**
   * The form's input models
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'password',
      name: 'password',
      inputType: 'password',
      autoComplete: 'new-password',
    }),
    new DynamicInputModel({
      id: 'passwordrepeat',
      name: 'passwordrepeat',
      inputType: 'password',
      autoComplete: 'new-password',
    }),
  ];

  /**
   * The form group of this form
   */
  formGroup: UntypedFormGroup;

  /**
   * Indicates whether the "checkPasswordEmpty" needs to be added or not
   */
  @Input()
  passwordCanBeEmpty = true;

  /**
   * Prefix for the form's label messages of this component
   */
  @Input()
  FORM_PREFIX: string;

  private subs: Subscription[] = [];

  constructor(protected formService: DynamicFormService,
              protected translate: TranslateService,
              protected epersonService: EPersonDataService,
              protected notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    if (this.FORM_PREFIX === 'profile.security.form.') {
      this.formModel.unshift(new DynamicInputModel({
        id: 'current-password',
        name: 'current-password',
        inputType: 'password',
        required: true,
        autoComplete: 'current-password',
      }));
    }
    if (this.passwordCanBeEmpty) {
      this.formGroup = this.formService.createFormGroup(this.formModel,
        { validators: [this.checkPasswordsEqual] });
    } else {
      this.formGroup = this.formService.createFormGroup(this.formModel,
        { validators: [this.checkPasswordsEqual, this.checkPasswordEmpty] });
    }
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });

    this.subs.push(
      this.formGroup.statusChanges.pipe(
        debounceTime(300),
        map((status: string) => status !== 'VALID'),
      ).subscribe((status) => this.isInvalid.emit(status)),
    );

    this.subs.push(this.formGroup.valueChanges.pipe(
      debounceTime(300),
    ).subscribe((valueChange) => {
      this.passwordValue.emit(valueChange.password);
      if (this.FORM_PREFIX === 'profile.security.form.') {
        this.currentPasswordValue.emit(valueChange['current-password']);
      }
    }));
  }

  /**
   * Update the translations of the field labels
   */
  updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.FORM_PREFIX + 'label.' + fieldModel.id);
      },
    );
  }

  /**
   * Check if both password fields are filled in and equal
   * @param group The FormGroup to validate
   */
  checkPasswordsEqual(group: UntypedFormGroup) {
    const pass = group.get('password').value;
    const repeatPass = group.get('passwordrepeat').value;

    return pass === repeatPass ? null : { notSame: true };
  }

  /**
   * Checks if the password is empty
   * @param group The FormGroup to validate
   */
  checkPasswordEmpty(group: UntypedFormGroup) {
    const pass = group.get('password').value;
    return isEmpty(pass) ? { emptyPassword: true } : null;
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}

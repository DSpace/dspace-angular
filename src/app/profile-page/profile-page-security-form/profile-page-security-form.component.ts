import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicFormControlModel, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { debounceTime, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
   * Emits the validity of the password
   */
  @Output() isInvalid = new EventEmitter<boolean>();
  /**
   * Emits the value of the password
   */
  @Output() passwordValue = new EventEmitter<string>();

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
    if (this.passwordCanBeEmpty) {
      this.formGroup = this.formService.createFormGroup(this.formModel,
        {validators: [this.checkPasswordsEqual, this.checkPasswordLength]});
    } else {
      this.formGroup = this.formService.createFormGroup(this.formModel,
        {validators: [this.checkPasswordsEqual, this.checkPasswordLength, this.checkPasswordEmpty]});
    }
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });

    this.subs.push(this.formGroup.statusChanges.pipe(
      debounceTime(300),
      map((status: string) => {
        if (status !== 'VALID') {
          return true;
        } else {
          return false;
        }
      })).subscribe((status) => this.isInvalid.emit(status))
    );

    this.subs.push(this.formGroup.valueChanges.pipe(
      debounceTime(300),
    ).subscribe((valueChange) => {
      this.passwordValue.emit(valueChange.password);
    }));
  }

  /**
   * Update the translations of the field labels
   */
  updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.FORM_PREFIX + 'label.' + fieldModel.id);
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

    return pass === repeatPass ? null : {notSame: true};
  }

  /**
   * Check if the password is at least 6 characters long
   * @param group The FormGroup to validate
   */
  checkPasswordLength(group: FormGroup) {
    const pass = group.get('password').value;

    return isEmpty(pass) || pass.length >= 6 ? null : {notLongEnough: true};
  }

  /**
   * Checks if the password is empty
   * @param group The FormGroup to validate
   */
  checkPasswordEmpty(group: FormGroup) {
    const pass = group.get('password').value;
    return isEmpty(pass) ? {emptyPassword: true} : null;
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

import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import { isEmpty, isNotEmpty, isNotUndefined } from '../empty.util';
import { find, uniqueId } from 'lodash';
import { FormChangeAction, FormRemoveErrorAction } from './form.actions';

@Injectable()
export class FormService {

  constructor(private formBuilderService: FormBuilderService,
              private store: Store<AppState>) {
  }

  /**
   * Method to retrieve form's status from state
   */
  public isValid(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.valid)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's data from state
   */
  public getFormData(formId: string): Observable<any> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.data)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's data from state
   */
  public isFormInitialized(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .distinctUntilChanged()
      .map((state) => isNotUndefined(state));
  }

  public getUniqueId(formId): string {
    return uniqueId() + '_' + formId;
  }

  /**
   * Method to validate form's fields
   */
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public addErrorToField(field: AbstractControl, model: DynamicFormControlModel, message: string) {

    const error = {}; // create the error object

    // if form control model has not errorMessages object, create it
    if (!model.errorMessages) {
      model.errorMessages = {};
    }

    // Use correct error messages from the model
    const lastArray = message.split('.');
    if (lastArray && lastArray.length > 0) {
      // check if error code is already present in the set of model's validators
      const last = lastArray[lastArray.length - 1];
      const modelMsg = model.errorMessages[last];
      if (isEmpty(modelMsg)) {
        const errorKey = uniqueId('error-'); // create a single key for the error
        error[errorKey] = true;
        // put the error message in the form control model
        model.errorMessages[errorKey] = message;
      } else {
        error[last] = modelMsg;
      }
    }

    // add the error in the form control
    field.setErrors(error);
    field.markAsTouched();
  }

  public removeErrorFromField(field: AbstractControl, model: DynamicFormControlModel, messageKey: string) {
    const error = {};

    if (messageKey.includes('.')) {
      // Use correct error messages from the model
      const lastArray = messageKey.split('.');
      if (lastArray && lastArray.length > 0) {
        const last = lastArray[lastArray.length - 1];
        error[last] = null;
      }
    } else {
      error[messageKey] = null;
    }

    field.setErrors(error);
    field.markAsUntouched();
  }

  public resetForm(formGroup: FormGroup, groupModel: DynamicFormControlModel[], formId: string) {
    this.formBuilderService.clearAllModelsValue(groupModel);
    formGroup.reset();
    this.store.dispatch(new FormChangeAction(formId, formGroup.value));
  }
}

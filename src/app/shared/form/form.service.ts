import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { isEmpty, isNotUndefined } from '../empty.util';
import { uniqueId } from 'lodash';
import {
  FormChangeAction,
  FormInitAction,
  FormRemoveAction, FormRemoveErrorAction,
  FormStatusChangeAction
} from './form.actions';
import { FormEntry } from './form.reducer';
import { environment } from '../../../environments/environment';

@Injectable()
export class FormService {

  constructor(
    private formBuilderService: FormBuilderService,
    private store: Store<AppState>) {
  }

  /**
   * Method to retrieve form's status from state
   */
  public isValid(formId: string): Observable<boolean> {
    return this.store.pipe(
      select(formObjectFromIdSelector(formId)),
      filter((state) => isNotUndefined(state)),
      map((state) => state.valid),
      distinctUntilChanged()
    );
  }

  /**
   * Method to retrieve form's data from state
   */
  public getFormData(formId: string): Observable<any> {
    return this.store.pipe(
      select(formObjectFromIdSelector(formId)),
      filter((state) => isNotUndefined(state)),
      map((state) => state.data),
      distinctUntilChanged()
    );
  }

  /**
   * Method to retrieve form's errors from state
   */
  public getFormErrors(formId: string): Observable<any> {
    return this.store.pipe(
      select(formObjectFromIdSelector(formId)),
      filter((state) => isNotUndefined(state)),
      map((state) => state.errors),
      distinctUntilChanged()
    );
  }

  /**
   * Method to retrieve form's data from state
   */
  public isFormInitialized(formId: string): Observable<boolean> {
    return this.store.pipe(
      select(formObjectFromIdSelector(formId)),
      distinctUntilChanged(),
      map((state) => isNotUndefined(state))
    );
  }

  public getUniqueId(formId): string {
    return uniqueId() + '_' + formId;
  }

  /**
   * Method to validate form's fields
   */
  public validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  public addErrorToField(field: AbstractControl, model: DynamicFormControlModel, message: string) {
    const error = {}; // create the error object
    const errorKey = this.getValidatorNameFromMap(message);
    let errorMsg = message;

    // if form control model has no errorMessages object, create it
    if (!model.errorMessages) {
      model.errorMessages = {};
    }

    // check if error code is already present in the set of model's validators
    if (isEmpty(model.errorMessages[errorKey])) {
      // put the error message in the form control model
      model.errorMessages[errorKey] = message;
    } else {
      // Use correct error messages from the model
      errorMsg = model.errorMessages[errorKey];
    }

    if (!field.hasError(errorKey)) {
      error[errorKey] = true;
      // add the error in the form control
      field.setErrors(error);
    }

    field.markAsTouched();
  }

  public removeErrorFromField(field: AbstractControl, model: DynamicFormControlModel, messageKey: string) {
    const error = {};
    const errorKey = this.getValidatorNameFromMap(messageKey);

    if (field.hasError(errorKey)) {
      error[errorKey] = null;
      field.setErrors(error);
    }

    field.markAsUntouched();
  }

  public resetForm(formGroup: FormGroup, groupModel: DynamicFormControlModel[], formId: string) {
    this.formBuilderService.clearAllModelsValue(groupModel);
    formGroup.reset();
    this.store.dispatch(new FormChangeAction(formId, formGroup.value));
  }

  private getValidatorNameFromMap(validator): string {
    if (validator.includes('.')) {
      const splitArray = validator.split('.');
      if (splitArray && splitArray.length > 0) {
        validator = this.getValidatorNameFromMap(splitArray[splitArray.length - 1]);
      }
    }
    return (environment.form.validatorMap.hasOwnProperty(validator)) ? environment.form.validatorMap[validator] : validator;
  }

  public initForm(formId: string, model: DynamicFormControlModel[], valid: boolean) {
    this.store.dispatch(new FormInitAction(formId, this.formBuilderService.getValueFromModel(model), valid));
  }

  public setStatusChanged(formId: string, valid: boolean) {
    this.store.dispatch(new FormStatusChangeAction(formId, valid))
  }

  public getForm(formId: string): Observable<FormEntry> {
    return this.store.pipe(select(formObjectFromIdSelector(formId)));
  }

  public removeForm(formId: string) {
    this.store.dispatch(new FormRemoveAction(formId));
  }

  public changeForm(formId: string, model: DynamicFormControlModel[]) {
    this.store.dispatch(new FormChangeAction(formId, this.formBuilderService.getValueFromModel(model)));
  }

  public removeError(formId: string, eventModelId: string, fieldIndex: number) {
    this.store.dispatch(new FormRemoveErrorAction(formId, eventModelId, fieldIndex));
  }
}

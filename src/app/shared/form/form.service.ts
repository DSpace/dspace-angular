import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import { isNotEmpty, isNotUndefined } from '../empty.util';
import { find, uniqueId } from 'lodash';

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
  public getFormData(formId: string): Observable<FormControl> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.data)
      .distinctUntilChanged();
  }

  public getUniqueId(formId): string {
    return uniqueId() + '_' + formId;
  }

  /**
   * Method to validate form's fields
   */
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public setValue(formGroup: FormGroup, fieldModel: DynamicFormControlModel, fieldId: string, value: any) {
    if (isNotEmpty(fieldModel)) {
      const path = this.formBuilderService.getPath(fieldModel);
      const fieldControl = formGroup.get(path);
      fieldControl.markAsDirty();
      fieldControl.setValue(value);
    }
  }

  public addErrorToField(field: AbstractControl, model: DynamicFormControlModel, message: string) {
    const errorFound = !!(find(field.errors, (err) => err === message));

    // search for the same error in the formControl.errors property
    if (!errorFound) {
      const errorKey = uniqueId('error-'); // create a single key for the error
      const error = {}; // create the error object

      error[ errorKey ] = message; // assign message

      // if form control model has errorMessages object, create it
      if (!model.errorMessages) {
        model.errorMessages = {};
      }

      // put the error in the form control model
      model.errorMessages[ errorKey ] = message;

      // add the error in the form control
      field.setErrors(error);

      // formGroup.markAsDirty();
      field.markAsTouched();
    }
  }
}

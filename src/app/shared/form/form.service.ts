import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import { isNotEmpty, isNotUndefined } from '../empty.util';

@Injectable()
export class FormService {

  constructor(private formBuilderService: FormBuilderService,
              private store: Store<AppState>) {}

  /**
   * Method to retrieve form's status from state
   */
  public isValid(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .map((state) => state.valid)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's data from state
   */
  public getFormData(formId: string): Observable<FormControl> {
    return this.store.select(formObjectFromIdSelector(formId))
      .map((state) => state.data)
      .distinctUntilChanged();
  }

  /**
   * Method to validate form's fields
   */
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      // console.log(field);
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
      console.log('formservice', fieldControl, path);
    }
  }

}

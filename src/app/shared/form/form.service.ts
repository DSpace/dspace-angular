import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';

@Injectable()
export class FormService {

  constructor(private store: Store<AppState>) {
  }

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

}

import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';

import MY_DEFINITION_FORM_JSON from '../../../backend/data/form1-definition.json';
import MY_DEFINITION_FORM_JSON2 from '../../../backend/data/form2-definition.json';

@Injectable()
export class FormService {

  constructor(private store: Store<AppState>) {}

  /**
   * Method to retrieve form's status from state
   */
  public isValid(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .map((state) =>  state.valid)
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
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Method to retrieve the form configuration
   */
  public getFormConfiguration(formId: string) {
    let selected = null;
    if (formId === 'http://dspace7.dev01.4science.it:8080/dspace-spring-rest/api/config/submission-forms/traditionalpageone') {
      selected = MY_DEFINITION_FORM_JSON;
    } else {
      selected = MY_DEFINITION_FORM_JSON2;
    }
    return selected;
  }
}

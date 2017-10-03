import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { FormGroup } from '@angular/forms';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const FormActionTypes = {
  FORM_INIT: type('dspace/form/FORM_INIT'),
  FORM_CHANGE: type('dspace/form/FORM_CHANGE')
};

/* tslint:disable:max-classes-per-file */
export class FormInitAction implements Action {
  type = FormActionTypes.FORM_INIT;
  payload: {
    formId: string;
    formData: FormGroup;
    valid: boolean;
  };

  /**
   * Create a new FormInitAction
   *
   * @param formId
   *    the Form's ID
   * @param formObject
   *    the FormGroup Object
   */
  constructor(formId: string, formData: FormGroup, valid: boolean) {
    this.payload = { formId, formData, valid };
  }
}

export class FormChangeAction implements Action {
  type = FormActionTypes.FORM_CHANGE;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FormAction
  = FormInitAction
  | FormChangeAction

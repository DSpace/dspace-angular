import { FormAction, FormActionTypes, FormInitAction } from './form.actions';
import { hasValue } from '../../shared/empty.util';

export interface FormEntry {
  data: any;
  valid: boolean;
}

export interface FormState {
  [formId: string]: FormEntry;
}

const initialState: FormState = Object.create(null);

export function formReducer(state = initialState, action: FormAction): FormState {
  switch (action.type) {

    case FormActionTypes.FORM_INIT: {
      return initForm(state, action as FormInitAction);
    }

    default: {
      return state;
    }
  }
}

/**
 * Set a panel enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an EnablePanelAction
 * @return SubmissionObjectState
 *    the new state, with the panel removed.
 */
function initForm(state: FormState, action: FormInitAction): FormState {
  if (!hasValue(state[action.payload.formId])) {
    return Object.assign({}, state, {[action.payload.formId]: {
      data: action.payload.formData,
      valid: action.payload.valid
    }});
  } else {
    const newState = Object.assign({}, state);
    newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], {
        data: action.payload.formData,
        valid:action.payload.valid
      }
    );
    return newState;
  }
}

import {
  FormAction, FormActionTypes, FormChangeAction, FormInitAction, FormRemoveAction,
  FormStatusChangeAction
} from './form.actions';
import { hasValue } from '../empty.util';
import { deleteProperty } from '../object.util';

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

    case FormActionTypes.FORM_CHANGE: {
      return changeDataForm(state, action as FormChangeAction);
    }

    case FormActionTypes.FORM_REMOVE: {
      return removeForm(state, action as FormRemoveAction);
    }

    case FormActionTypes.FORM_STATUS_CHANGE: {
      return changeStatusForm(state, action as FormStatusChangeAction);
    }

    default: {
      return state;
    }
  }
}

/**
 * Init form state.
 *
 * @param state
 *    the current state
 * @param action
 *    an FormInitAction
 * @return FormState
 *    the new state, with the form initialized.
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

/**
 * Set form data.
 *
 * @param state
 *    the current state
 * @param action
 *    an FormChangeAction
 * @return FormState
 *    the new state, with the data changed.
 */
function changeDataForm(state: FormState, action: FormChangeAction): FormState {
  if (!hasValue(state[action.payload.formId])) {
    return Object.assign({}, state, {[action.payload.formId]: {
      data: action.payload.formData,
      valid: state[action.payload.formId].valid
    }});
  } else {
    const newState = Object.assign({}, state);
    newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], {
        data: action.payload.formData,
        valid: state[action.payload.formId].valid
      }
    );
    return newState;
  }
}

/**
 * Set form status.
 *
 * @param state
 *    the current state
 * @param action
 *    an FormStatusChangeAction
 * @return FormState
 *    the new state, with the status changed.
 */
function changeStatusForm(state: FormState, action: FormStatusChangeAction): FormState {
  if (!hasValue(state[action.payload.formId])) {
    return Object.assign({}, state, {[action.payload.formId]: {
      data: state[action.payload.formId].data,
      valid: action.payload.valid
    }});
  } else {
    const newState = Object.assign({}, state);
    newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], {
        data: state[action.payload.formId].data,
        valid: action.payload.valid
      }
    );
    return newState;
  }
}

/**
 * Remove form state.
 *
 * @param state
 *    the current state
 * @param action
 *    an FormRemoveAction
 * @return FormState
 *    the new state, with the form initialized.
 */
function removeForm(state: FormState, action: FormRemoveAction): FormState {
  if (hasValue(state[action.payload.formId])) {
    const newState = Object.assign({}, state);
    delete newState[action.payload.formId]
    return newState;
  } else {
    return state;
  }
}

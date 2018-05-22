import {
  FormAction, FormActionTypes, FormAddError, FormChangeAction, FormInitAction, FormRemoveAction, FormRemoveErrorAction,
  FormStatusChangeAction
} from './form.actions';
import { hasValue } from '../empty.util';
import { uniqWith, isEqual } from 'lodash';

export interface FormError {
  message: string;
  fieldId: string;
}

export interface FormEntry {
  data: any;
  valid: boolean;
  errors: FormError[];
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

    case FormActionTypes.FORM_ADD_ERROR: {
      return addFormErrors(state, action as FormAddError)
    }

    case FormActionTypes.FORM_REMOVE_ERROR: {
      return removeFormError(state, action as FormRemoveErrorAction)
    }

    default: {
      return state;
    }
  }
}

function addFormErrors(state: FormState, action: FormAddError) {
  const formId = action.payload.formId;
  if (hasValue(state[formId])) {
    const error: FormError = {
      fieldId: action.payload.fieldId,
      message: action.payload.errorMessage
    };

    return Object.assign({}, state, {
      [ formId ]: {
        data: state[formId].data,
        valid: state[formId].valid,
        errors: state[formId].errors ? uniqWith(state[formId].errors.concat(error), isEqual) : [].concat(error),
      }
    });
  } else {
    return state;
  }
}

function removeFormError(state: FormState, action: FormRemoveErrorAction) {
  const formId = action.payload.formId;
  const fieldId = action.payload.fieldId;
  if (hasValue(state[formId])) {
    const errors = state[formId].errors.filter((error) => error.fieldId !== fieldId);
    const newState = Object.assign({}, state);
    newState[ formId ] = Object.assign({}, state[formId], {errors})
    return newState
  } else {
    return state;
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
  if (!hasValue(state[ action.payload.formId ])) {
    return Object.assign({}, state, {
      [ action.payload.formId ]: {
        data: action.payload.formData,
        valid: action.payload.valid,
        errors: []
      }
    });
  } else {
    const newState = Object.assign({}, state);
    newState[ action.payload.formId ] = Object.assign({}, newState[ action.payload.formId ], {
        data: action.payload.formData,
        valid: action.payload.valid,
        errors: []
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
  if (!hasValue(state[ action.payload.formId ])) {
    return Object.assign({}, state, {
      [ action.payload.formId ]: {
        data: action.payload.formData,
        valid: state[ action.payload.formId ].valid
      }
    });
  } else {
    const newState = Object.assign({}, state);
    newState[ action.payload.formId ] = Object.assign({}, newState[ action.payload.formId ], {
        data: action.payload.formData,
        valid: state[ action.payload.formId ].valid
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
  if (!hasValue(state[ action.payload.formId ])) {
    return Object.assign({}, state, {
      [ action.payload.formId ]: {
        data: state[ action.payload.formId ].data,
        valid: action.payload.valid
      }
    });
  } else {
    const newState = Object.assign({}, state);
    newState[ action.payload.formId ] = Object.assign({}, newState[ action.payload.formId ], {
        data: state[ action.payload.formId ].data,
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
  if (hasValue(state[ action.payload.formId ])) {
    const newState = Object.assign({}, state);
    delete newState[ action.payload.formId ];
    return newState;
  } else {
    return state;
  }
}

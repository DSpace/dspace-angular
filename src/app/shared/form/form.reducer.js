import { FormActionTypes } from './form.actions';
import { hasValue } from '../empty.util';
import { isEqual, uniqWith } from 'lodash';
var initialState = Object.create(null);
export function formReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case FormActionTypes.FORM_INIT: {
            return initForm(state, action);
        }
        case FormActionTypes.FORM_CHANGE: {
            return changeDataForm(state, action);
        }
        case FormActionTypes.FORM_REMOVE: {
            return removeForm(state, action);
        }
        case FormActionTypes.FORM_STATUS_CHANGE: {
            return changeStatusForm(state, action);
        }
        case FormActionTypes.FORM_ADD_ERROR: {
            return addFormErrors(state, action);
        }
        case FormActionTypes.FORM_REMOVE_ERROR: {
            return removeFormError(state, action);
        }
        case FormActionTypes.FORM_CLEAR_ERRORS: {
            return clearsFormErrors(state, action);
        }
        default: {
            return state;
        }
    }
}
function addFormErrors(state, action) {
    var _a;
    var formId = action.payload.formId;
    if (hasValue(state[formId])) {
        var error = {
            fieldId: action.payload.fieldId,
            fieldIndex: action.payload.fieldIndex,
            message: action.payload.errorMessage
        };
        return Object.assign({}, state, (_a = {},
            _a[formId] = {
                data: state[formId].data,
                valid: state[formId].valid,
                errors: state[formId].errors ? uniqWith(state[formId].errors.concat(error), isEqual) : [].concat(error),
            },
            _a));
    }
    else {
        return state;
    }
}
function removeFormError(state, action) {
    var formId = action.payload.formId;
    var fieldId = action.payload.fieldId;
    var fieldIndex = action.payload.fieldIndex;
    if (hasValue(state[formId])) {
        var errors = state[formId].errors.filter(function (error) { return error.fieldId !== fieldId || error.fieldIndex !== fieldIndex; });
        var newState = Object.assign({}, state);
        newState[formId] = Object.assign({}, state[formId], { errors: errors });
        return newState;
    }
    else {
        return state;
    }
}
function clearsFormErrors(state, action) {
    var formId = action.payload.formId;
    if (hasValue(state[formId])) {
        var errors = [];
        var newState = Object.assign({}, state);
        newState[formId] = Object.assign({}, state[formId], { errors: errors });
        return newState;
    }
    else {
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
function initForm(state, action) {
    var _a;
    var formState = {
        data: action.payload.formData,
        valid: action.payload.valid,
        errors: []
    };
    if (!hasValue(state[action.payload.formId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.formId] = formState,
            _a));
    }
    else {
        var newState = Object.assign({}, state);
        newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], formState);
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
function changeDataForm(state, action) {
    if (hasValue(state[action.payload.formId])) {
        var newState = Object.assign({}, state);
        newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], {
            data: action.payload.formData,
            valid: state[action.payload.formId].valid
        });
        return newState;
    }
    else {
        return state;
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
function changeStatusForm(state, action) {
    var _a;
    if (!hasValue(state[action.payload.formId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.formId] = {
                data: state[action.payload.formId].data,
                valid: action.payload.valid
            },
            _a));
    }
    else {
        var newState = Object.assign({}, state);
        newState[action.payload.formId] = Object.assign({}, newState[action.payload.formId], {
            data: state[action.payload.formId].data,
            valid: action.payload.valid
        });
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
function removeForm(state, action) {
    if (hasValue(state[action.payload.formId])) {
        var newState = Object.assign({}, state);
        delete newState[action.payload.formId];
        return newState;
    }
    else {
        return state;
    }
}
//# sourceMappingURL=form.reducer.js.map
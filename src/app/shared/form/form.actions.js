import { type } from '../ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var FormActionTypes = {
    FORM_INIT: type('dspace/form/FORM_INIT'),
    FORM_CHANGE: type('dspace/form/FORM_CHANGE'),
    FORM_REMOVE: type('dspace/form/FORM_REMOVE'),
    FORM_STATUS_CHANGE: type('dspace/form/FORM_STATUS_CHANGE'),
    FORM_ADD_ERROR: type('dspace/form/FORM_ADD_ERROR'),
    FORM_REMOVE_ERROR: type('dspace/form/FORM_REMOVE_ERROR'),
    FORM_CLEAR_ERRORS: type('dspace/form/FORM_CLEAR_ERRORS'),
};
/* tslint:disable:max-classes-per-file */
var FormInitAction = /** @class */ (function () {
    /**
     * Create a new FormInitAction
     *
     * @param formId
     *    the Form's ID
     * @param formData
     *    the FormGroup Object
     * @param valid
     *    the Form validation status
     */
    function FormInitAction(formId, formData, valid) {
        this.type = FormActionTypes.FORM_INIT;
        this.payload = { formId: formId, formData: formData, valid: valid };
    }
    return FormInitAction;
}());
export { FormInitAction };
var FormChangeAction = /** @class */ (function () {
    /**
     * Create a new FormInitAction
     *
     * @param formId
     *    the Form's ID
     * @param formData
     *    the FormGroup Object
     */
    function FormChangeAction(formId, formData) {
        this.type = FormActionTypes.FORM_CHANGE;
        this.payload = { formId: formId, formData: formData };
    }
    return FormChangeAction;
}());
export { FormChangeAction };
var FormRemoveAction = /** @class */ (function () {
    /**
     * Create a new FormRemoveAction
     *
     * @param formId
     *    the Form's ID
     */
    function FormRemoveAction(formId) {
        this.type = FormActionTypes.FORM_REMOVE;
        this.payload = { formId: formId };
    }
    return FormRemoveAction;
}());
export { FormRemoveAction };
var FormStatusChangeAction = /** @class */ (function () {
    /**
     * Create a new FormInitAction
     *
     * @param formId
     *    the Form's ID
     * @param valid
     *    the Form validation status
     */
    function FormStatusChangeAction(formId, valid) {
        this.type = FormActionTypes.FORM_STATUS_CHANGE;
        this.payload = { formId: formId, valid: valid };
    }
    return FormStatusChangeAction;
}());
export { FormStatusChangeAction };
var FormAddError = /** @class */ (function () {
    function FormAddError(formId, fieldId, fieldIndex, errorMessage) {
        this.type = FormActionTypes.FORM_ADD_ERROR;
        this.payload = { formId: formId, fieldId: fieldId, fieldIndex: fieldIndex, errorMessage: errorMessage };
    }
    return FormAddError;
}());
export { FormAddError };
var FormRemoveErrorAction = /** @class */ (function () {
    function FormRemoveErrorAction(formId, fieldId, fieldIndex) {
        this.type = FormActionTypes.FORM_REMOVE_ERROR;
        this.payload = { formId: formId, fieldId: fieldId, fieldIndex: fieldIndex };
    }
    return FormRemoveErrorAction;
}());
export { FormRemoveErrorAction };
var FormClearErrorsAction = /** @class */ (function () {
    function FormClearErrorsAction(formId) {
        this.type = FormActionTypes.FORM_CLEAR_ERRORS;
        this.payload = { formId: formId };
    }
    return FormClearErrorsAction;
}());
export { FormClearErrorsAction };
//# sourceMappingURL=form.actions.js.map
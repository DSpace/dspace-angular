import * as tslib_1 from "tslib";
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { isEmpty, isNotUndefined } from '../empty.util';
import { uniqueId } from 'lodash';
import { FormChangeAction, FormInitAction, FormRemoveAction, FormRemoveErrorAction, FormStatusChangeAction } from './form.actions';
import { GLOBAL_CONFIG } from '../../../config';
var FormService = /** @class */ (function () {
    function FormService(config, formBuilderService, store) {
        this.config = config;
        this.formBuilderService = formBuilderService;
        this.store = store;
    }
    /**
     * Method to retrieve form's status from state
     */
    FormService.prototype.isValid = function (formId) {
        return this.store.pipe(select(formObjectFromIdSelector(formId)), filter(function (state) { return isNotUndefined(state); }), map(function (state) { return state.valid; }), distinctUntilChanged());
    };
    /**
     * Method to retrieve form's data from state
     */
    FormService.prototype.getFormData = function (formId) {
        return this.store.pipe(select(formObjectFromIdSelector(formId)), filter(function (state) { return isNotUndefined(state); }), map(function (state) { return state.data; }), distinctUntilChanged());
    };
    /**
     * Method to retrieve form's errors from state
     */
    FormService.prototype.getFormErrors = function (formId) {
        return this.store.pipe(select(formObjectFromIdSelector(formId)), filter(function (state) { return isNotUndefined(state); }), map(function (state) { return state.errors; }), distinctUntilChanged());
    };
    /**
     * Method to retrieve form's data from state
     */
    FormService.prototype.isFormInitialized = function (formId) {
        return this.store.pipe(select(formObjectFromIdSelector(formId)), distinctUntilChanged(), map(function (state) { return isNotUndefined(state); }));
    };
    FormService.prototype.getUniqueId = function (formId) {
        return uniqueId() + '_' + formId;
    };
    /**
     * Method to validate form's fields
     */
    FormService.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
                control.markAsDirty({ onlySelf: true });
            }
            else if (control instanceof FormGroup || control instanceof FormArray) {
                _this.validateAllFormFields(control);
            }
        });
    };
    FormService.prototype.addErrorToField = function (field, model, message) {
        var error = {}; // create the error object
        var errorKey = this.getValidatorNameFromMap(message);
        var errorMsg = message;
        // if form control model has no errorMessages object, create it
        if (!model.errorMessages) {
            model.errorMessages = {};
        }
        // check if error code is already present in the set of model's validators
        if (isEmpty(model.errorMessages[errorKey])) {
            // put the error message in the form control model
            model.errorMessages[errorKey] = message;
        }
        else {
            // Use correct error messages from the model
            errorMsg = model.errorMessages[errorKey];
        }
        if (!field.hasError(errorKey)) {
            error[errorKey] = true;
            // add the error in the form control
            field.setErrors(error);
        }
        field.markAsTouched();
    };
    FormService.prototype.removeErrorFromField = function (field, model, messageKey) {
        var error = {};
        var errorKey = this.getValidatorNameFromMap(messageKey);
        if (field.hasError(errorKey)) {
            error[errorKey] = null;
            field.setErrors(error);
        }
        field.markAsUntouched();
    };
    FormService.prototype.resetForm = function (formGroup, groupModel, formId) {
        this.formBuilderService.clearAllModelsValue(groupModel);
        formGroup.reset();
        this.store.dispatch(new FormChangeAction(formId, formGroup.value));
    };
    FormService.prototype.getValidatorNameFromMap = function (validator) {
        if (validator.includes('.')) {
            var splitArray = validator.split('.');
            if (splitArray && splitArray.length > 0) {
                validator = this.getValidatorNameFromMap(splitArray[splitArray.length - 1]);
            }
        }
        return (this.config.form.validatorMap.hasOwnProperty(validator)) ? this.config.form.validatorMap[validator] : validator;
    };
    FormService.prototype.initForm = function (formId, model, valid) {
        this.store.dispatch(new FormInitAction(formId, this.formBuilderService.getValueFromModel(model), valid));
    };
    FormService.prototype.setStatusChanged = function (formId, valid) {
        this.store.dispatch(new FormStatusChangeAction(formId, valid));
    };
    FormService.prototype.getForm = function (formId) {
        return this.store.pipe(select(formObjectFromIdSelector(formId)));
    };
    FormService.prototype.removeForm = function (formId) {
        this.store.dispatch(new FormRemoveAction(formId));
    };
    FormService.prototype.changeForm = function (formId, model) {
        this.store.dispatch(new FormChangeAction(formId, this.formBuilderService.getValueFromModel(model)));
    };
    FormService.prototype.removeError = function (formId, eventModelId, fieldIndex) {
        this.store.dispatch(new FormRemoveErrorAction(formId, eventModelId, fieldIndex));
    };
    FormService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, FormBuilderService,
            Store])
    ], FormService);
    return FormService;
}());
export { FormService };
//# sourceMappingURL=form.service.js.map
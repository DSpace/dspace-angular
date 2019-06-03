import * as tslib_1 from "tslib";
import { Store } from '@ngrx/store';
import { NewPatchAddOperationAction, NewPatchRemoveOperationAction, NewPatchReplaceOperationAction } from '../json-patch-operations.actions';
import { Injectable } from '@angular/core';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { dateToISOFormat } from '../../../shared/date.util';
import { AuthorityValue } from '../../integration/models/authority.value';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
/**
 * Provides methods to dispatch JsonPatch Operations Actions
 */
var JsonPatchOperationsBuilder = /** @class */ (function () {
    function JsonPatchOperationsBuilder(store) {
        this.store = store;
    }
    /**
     * Dispatches a new NewPatchAddOperationAction
     *
     * @param path
     *    a JsonPatchOperationPathObject representing path
     * @param value
     *    The value to update the referenced path
     * @param first
     *    A boolean representing if the value to be added is the first of an array
     * @param plain
     *    A boolean representing if the value to be added is a plain text value
     */
    JsonPatchOperationsBuilder.prototype.add = function (path, value, first, plain) {
        if (first === void 0) { first = false; }
        if (plain === void 0) { plain = false; }
        this.store.dispatch(new NewPatchAddOperationAction(path.rootElement, path.subRootElement, path.path, this.prepareValue(value, plain, first)));
    };
    /**
     * Dispatches a new NewPatchReplaceOperationAction
     *
     * @param path
     *    a JsonPatchOperationPathObject representing path
     * @param value
     *    the value to update the referenced path
     * @param plain
     *    a boolean representing if the value to be added is a plain text value
     */
    JsonPatchOperationsBuilder.prototype.replace = function (path, value, plain) {
        if (plain === void 0) { plain = false; }
        this.store.dispatch(new NewPatchReplaceOperationAction(path.rootElement, path.subRootElement, path.path, this.prepareValue(value, plain, false)));
    };
    /**
     * Dispatches a new NewPatchRemoveOperationAction
     *
     * @param path
     *    a JsonPatchOperationPathObject representing path
     */
    JsonPatchOperationsBuilder.prototype.remove = function (path) {
        this.store.dispatch(new NewPatchRemoveOperationAction(path.rootElement, path.subRootElement, path.path));
    };
    JsonPatchOperationsBuilder.prototype.prepareValue = function (value, plain, first) {
        var _this = this;
        var operationValue = null;
        if (isNotEmpty(value)) {
            if (plain) {
                operationValue = value;
            }
            else {
                if (Array.isArray(value)) {
                    operationValue = [];
                    value.forEach(function (entry) {
                        if ((typeof entry === 'object')) {
                            operationValue.push(_this.prepareObjectValue(entry));
                        }
                        else {
                            operationValue.push(new FormFieldMetadataValueObject(entry));
                        }
                    });
                }
                else if (typeof value === 'object') {
                    operationValue = this.prepareObjectValue(value);
                }
                else {
                    operationValue = new FormFieldMetadataValueObject(value);
                }
            }
        }
        return (first && !Array.isArray(operationValue)) ? [operationValue] : operationValue;
    };
    JsonPatchOperationsBuilder.prototype.prepareObjectValue = function (value) {
        var _this = this;
        var operationValue = Object.create({});
        if (isEmpty(value) || value instanceof FormFieldMetadataValueObject) {
            operationValue = value;
        }
        else if (value instanceof Date) {
            operationValue = new FormFieldMetadataValueObject(dateToISOFormat(value));
        }
        else if (value instanceof AuthorityValue) {
            operationValue = this.prepareAuthorityValue(value);
        }
        else if (value instanceof FormFieldLanguageValueObject) {
            operationValue = new FormFieldMetadataValueObject(value.value, value.language);
        }
        else if (value.hasOwnProperty('value')) {
            operationValue = new FormFieldMetadataValueObject(value.value);
        }
        else {
            Object.keys(value)
                .forEach(function (key) {
                if (typeof value[key] === 'object') {
                    operationValue[key] = _this.prepareObjectValue(value[key]);
                }
                else {
                    operationValue[key] = value[key];
                }
            });
        }
        return operationValue;
    };
    JsonPatchOperationsBuilder.prototype.prepareAuthorityValue = function (value) {
        var operationValue = null;
        if (isNotEmpty(value.id)) {
            operationValue = new FormFieldMetadataValueObject(value.value, value.language, value.id);
        }
        else {
            operationValue = new FormFieldMetadataValueObject(value.value, value.language);
        }
        return operationValue;
    };
    JsonPatchOperationsBuilder = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], JsonPatchOperationsBuilder);
    return JsonPatchOperationsBuilder;
}());
export { JsonPatchOperationsBuilder };
//# sourceMappingURL=json-patch-operations-builder.js.map
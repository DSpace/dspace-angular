import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { isEqual, isObject } from 'lodash';
import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY, DYNAMIC_FORM_CONTROL_TYPE_GROUP } from '@ng-dynamic-forms/core';
import { isNotEmpty, isNotNull, isNotUndefined, isNull, isUndefined } from '../../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
import { AuthorityValue } from '../../../core/integration/models/authority.value';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
/**
 * The service handling all form section operations
 */
var SectionFormOperationsService = /** @class */ (function () {
    /**
     * Initialize service variables
     *
     * @param {FormBuilderService} formBuilder
     * @param {JsonPatchOperationsBuilder} operationsBuilder
     */
    function SectionFormOperationsService(formBuilder, operationsBuilder) {
        this.formBuilder = formBuilder;
        this.operationsBuilder = operationsBuilder;
    }
    /**
     * Dispatch properly method based on form operation type
     *
     * @param pathCombiner
     *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @param previousValue
     *    the [[FormFieldPreviousValueObject]] for the specified operation
     * @param hasStoredValue
     *    representing if field value related to the specified operation has stored value
     */
    SectionFormOperationsService.prototype.dispatchOperationsFromEvent = function (pathCombiner, event, previousValue, hasStoredValue) {
        switch (event.type) {
            case 'remove':
                this.dispatchOperationsFromRemoveEvent(pathCombiner, event, previousValue);
                break;
            case 'change':
                this.dispatchOperationsFromChangeEvent(pathCombiner, event, previousValue, hasStoredValue);
                break;
            default:
                break;
        }
    };
    /**
     * Return index if specified field is part of fields array
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return number
     *    the array index is part of array, zero otherwise
     */
    SectionFormOperationsService.prototype.getArrayIndexFromEvent = function (event) {
        var fieldIndex;
        if (isNotEmpty(event)) {
            if (isNull(event.context)) {
                // Check whether model is part of an Array of group
                if (this.isPartOfArrayOfGroup(event.model)) {
                    fieldIndex = event.model.parent.parent.index;
                }
            }
            else {
                fieldIndex = event.context.index;
            }
        }
        // if field index is undefined model is not part of array of fields
        return isNotUndefined(fieldIndex) ? fieldIndex : 0;
    };
    /**
     * Check if specified model is part of array of group
     *
     * @param model
     *    the [[DynamicFormControlModel]] model
     * @return boolean
     *    true if is part of array, false otherwise
     */
    SectionFormOperationsService.prototype.isPartOfArrayOfGroup = function (model) {
        return (isNotNull(model.parent)
            && model.parent.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP
            && model.parent.parent
            && model.parent.parent.context
            && model.parent.parent.context.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY);
    };
    /**
     * Return a map for the values of a Qualdrop field
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return Map<string, any>
     *    the map of values
     */
    SectionFormOperationsService.prototype.getQualdropValueMap = function (event) {
        var metadataValueMap = new Map();
        var context = this.formBuilder.isQualdropGroup(event.model)
            ? event.model.parent.context
            : event.model.parent.parent.context;
        context.groups.forEach(function (arrayModel) {
            var groupModel = arrayModel.group[0];
            var metadataValueList = metadataValueMap.get(groupModel.qualdropId) ? metadataValueMap.get(groupModel.qualdropId) : [];
            if (groupModel.value) {
                metadataValueList.push(groupModel.value);
                metadataValueMap.set(groupModel.qualdropId, metadataValueList);
            }
        });
        return metadataValueMap;
    };
    /**
     * Return the absolute path for the field interesting in the specified operation
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return string
     *    the field path
     */
    SectionFormOperationsService.prototype.getFieldPathFromEvent = function (event) {
        var fieldIndex = this.getArrayIndexFromEvent(event);
        var fieldId = this.getFieldPathSegmentedFromChangeEvent(event);
        return (isNotUndefined(fieldIndex)) ? fieldId + '/' + fieldIndex : fieldId;
    };
    /**
     * Return the absolute path for the Qualdrop field interesting in the specified operation
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return string
     *    the field path
     */
    SectionFormOperationsService.prototype.getQualdropItemPathFromEvent = function (event) {
        var fieldIndex = this.getArrayIndexFromEvent(event);
        var metadataValueMap = new Map();
        var path = null;
        var context = this.formBuilder.isQualdropGroup(event.model)
            ? event.model.parent.context
            : event.model.parent.parent.context;
        context.groups.forEach(function (arrayModel, index) {
            var groupModel = arrayModel.group[0];
            var metadataValueList = metadataValueMap.get(groupModel.qualdropId) ? metadataValueMap.get(groupModel.qualdropId) : [];
            if (groupModel.value) {
                metadataValueList.push(groupModel.value);
                metadataValueMap.set(groupModel.qualdropId, metadataValueList);
            }
            if (index === fieldIndex) {
                path = groupModel.qualdropId + '/' + (metadataValueMap.get(groupModel.qualdropId).length - 1);
            }
        });
        return path;
    };
    /**
     * Return the segmented path for the field interesting in the specified change operation
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return string
     *    the field path
     */
    SectionFormOperationsService.prototype.getFieldPathSegmentedFromChangeEvent = function (event) {
        var fieldId;
        if (this.formBuilder.isQualdropGroup(event.model)) {
            fieldId = event.model.qualdropId;
        }
        else if (this.formBuilder.isQualdropGroup(event.model.parent)) {
            fieldId = event.model.parent.qualdropId;
        }
        else {
            fieldId = this.formBuilder.getId(event.model);
        }
        return fieldId;
    };
    /**
     * Return the value of the field interesting in the specified change operation
     *
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @return any
     *    the field value
     */
    SectionFormOperationsService.prototype.getFieldValueFromChangeEvent = function (event) {
        var fieldValue;
        var value = event.model.value;
        if (this.formBuilder.isModelInCustomGroup(event.model)) {
            fieldValue = event.model.parent.value;
        }
        else if (this.formBuilder.isRelationGroup(event.model)) {
            fieldValue = event.model.getGroupValue();
        }
        else if (event.model.hasLanguages) {
            var language_1 = event.model.language;
            if (event.model.hasAuthority) {
                if (Array.isArray(value)) {
                    value.forEach(function (authority, index) {
                        authority = Object.assign(new AuthorityValue(), authority, { language: language_1 });
                        value[index] = authority;
                    });
                    fieldValue = value;
                }
                else {
                    fieldValue = Object.assign(new AuthorityValue(), value, { language: language_1 });
                }
            }
            else {
                // Language without Authority (input, textArea)
                fieldValue = new FormFieldMetadataValueObject(value, language_1);
            }
        }
        else if (value instanceof FormFieldLanguageValueObject || value instanceof AuthorityValue || isObject(value)) {
            fieldValue = value;
        }
        else {
            fieldValue = new FormFieldMetadataValueObject(value);
        }
        return fieldValue;
    };
    /**
     * Return a map for the values of an array of field
     *
     * @param items
     *    the list of items
     * @return Map<string, any>
     *    the map of values
     */
    SectionFormOperationsService.prototype.getValueMap = function (items) {
        var metadataValueMap = new Map();
        items.forEach(function (item) {
            Object.keys(item)
                .forEach(function (key) {
                var metadataValueList = metadataValueMap.get(key) ? metadataValueMap.get(key) : [];
                metadataValueList.push(item[key]);
                metadataValueMap.set(key, metadataValueList);
            });
        });
        return metadataValueMap;
    };
    /**
     * Handle form remove operations
     *
     * @param pathCombiner
     *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @param previousValue
     *    the [[FormFieldPreviousValueObject]] for the specified operation
     */
    SectionFormOperationsService.prototype.dispatchOperationsFromRemoveEvent = function (pathCombiner, event, previousValue) {
        var path = this.getFieldPathFromEvent(event);
        var value = this.getFieldValueFromChangeEvent(event);
        if (this.formBuilder.isQualdropGroup(event.model)) {
            this.dispatchOperationsFromMap(this.getQualdropValueMap(event), pathCombiner, event, previousValue);
        }
        else if (isNotEmpty(value)) {
            this.operationsBuilder.remove(pathCombiner.getPath(path));
        }
    };
    /**
     * Handle form change operations
     *
     * @param pathCombiner
     *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @param previousValue
     *    the [[FormFieldPreviousValueObject]] for the specified operation
     * @param hasStoredValue
     *    representing if field value related to the specified operation has stored value
     */
    SectionFormOperationsService.prototype.dispatchOperationsFromChangeEvent = function (pathCombiner, event, previousValue, hasStoredValue) {
        var path = this.getFieldPathFromEvent(event);
        var segmentedPath = this.getFieldPathSegmentedFromChangeEvent(event);
        var value = this.getFieldValueFromChangeEvent(event);
        // Detect which operation must be dispatched
        if (this.formBuilder.isQualdropGroup(event.model.parent)) {
            // It's a qualdrup model
            this.dispatchOperationsFromMap(this.getQualdropValueMap(event), pathCombiner, event, previousValue);
        }
        else if (this.formBuilder.isRelationGroup(event.model)) {
            // It's a relation model
            this.dispatchOperationsFromMap(this.getValueMap(value), pathCombiner, event, previousValue);
        }
        else if (this.formBuilder.hasArrayGroupValue(event.model)) {
            // Model has as value an array, so dispatch an add operation with entire block of values
            this.operationsBuilder.add(pathCombiner.getPath(segmentedPath), value, true);
        }
        else if (previousValue.isPathEqual(this.formBuilder.getPath(event.model)) || hasStoredValue) {
            // Here model has a previous value changed or stored in the server
            if (!value.hasValue()) {
                // New value is empty, so dispatch a remove operation
                if (this.getArrayIndexFromEvent(event) === 0) {
                    this.operationsBuilder.remove(pathCombiner.getPath(segmentedPath));
                }
                else {
                    this.operationsBuilder.remove(pathCombiner.getPath(path));
                }
            }
            else {
                // New value is not equal from the previous one, so dispatch a replace operation
                this.operationsBuilder.replace(pathCombiner.getPath(path), value);
            }
            previousValue.delete();
        }
        else if (value.hasValue()) {
            // Here model has no previous value but a new one
            if (isUndefined(this.getArrayIndexFromEvent(event))
                || this.getArrayIndexFromEvent(event) === 0) {
                // Model is single field or is part of an array model but is the first item,
                // so dispatch an add operation that initialize the values of a specific metadata
                this.operationsBuilder.add(pathCombiner.getPath(segmentedPath), value, true);
            }
            else {
                // Model is part of an array model but is not the first item,
                // so dispatch an add operation that add a value to an existent metadata
                this.operationsBuilder.add(pathCombiner.getPath(path), value);
            }
        }
    };
    /**
     * Handle form operations interesting a field with a map as value
     *
     * @param valueMap
     *    map of values
     * @param pathCombiner
     *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
     * @param event
     *    the [[DynamicFormControlEvent]] for the specified operation
     * @param previousValue
     *    the [[FormFieldPreviousValueObject]] for the specified operation
     */
    SectionFormOperationsService.prototype.dispatchOperationsFromMap = function (valueMap, pathCombiner, event, previousValue) {
        var _this = this;
        var currentValueMap = valueMap;
        if (event.type === 'remove') {
            var path = this.getQualdropItemPathFromEvent(event);
            this.operationsBuilder.remove(pathCombiner.getPath(path));
        }
        else {
            if (previousValue.isPathEqual(this.formBuilder.getPath(event.model))) {
                previousValue.value.forEach(function (entry, index) {
                    var currentValue = currentValueMap.get(index);
                    if (currentValue) {
                        if (!isEqual(entry, currentValue)) {
                            _this.operationsBuilder.add(pathCombiner.getPath(index), currentValue, true);
                        }
                        currentValueMap.delete(index);
                    }
                    else if (!currentValue) {
                        _this.operationsBuilder.remove(pathCombiner.getPath(index));
                    }
                });
            }
            currentValueMap.forEach(function (entry, index) {
                if (entry.length === 1 && isNull(entry[0])) {
                    // The last item of the group has been deleted so make a remove op
                    _this.operationsBuilder.remove(pathCombiner.getPath(index));
                }
                else {
                    _this.operationsBuilder.add(pathCombiner.getPath(index), entry, true);
                }
            });
        }
        previousValue.delete();
    };
    SectionFormOperationsService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [FormBuilderService,
            JsonPatchOperationsBuilder])
    ], SectionFormOperationsService);
    return SectionFormOperationsService;
}());
export { SectionFormOperationsService };
//# sourceMappingURL=section-form-operations.service.js.map
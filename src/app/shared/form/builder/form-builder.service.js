import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY, DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP, DYNAMIC_FORM_CONTROL_TYPE_GROUP, DYNAMIC_FORM_CONTROL_TYPE_INPUT, DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP, DynamicFormService, JSONUtils, } from '@ng-dynamic-forms/core';
import { isObject, isString, mergeWith } from 'lodash';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNotUndefined, isNull } from '../../empty.util';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { RowParser } from './parsers/row-parser';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { FormFieldMetadataValueObject } from './models/form-field-metadata-value.model';
import { isNgbDateStruct } from '../../date.util';
var FormBuilderService = /** @class */ (function (_super) {
    tslib_1.__extends(FormBuilderService, _super);
    function FormBuilderService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormBuilderService.prototype.findById = function (id, groupModel, arrayIndex) {
        var _this = this;
        if (arrayIndex === void 0) { arrayIndex = null; }
        var result = null;
        var findByIdFn = function (findId, findGroupModel, findArrayIndex) {
            for (var _i = 0, findGroupModel_1 = findGroupModel; _i < findGroupModel_1.length; _i++) {
                var controlModel = findGroupModel_1[_i];
                if (controlModel.id === findId) {
                    if (_this.isArrayGroup(controlModel) && isNotNull(findArrayIndex)) {
                        result = controlModel.get(findArrayIndex);
                    }
                    else {
                        result = controlModel;
                    }
                    break;
                }
                if (_this.isGroup(controlModel)) {
                    findByIdFn(findId, controlModel.group, findArrayIndex);
                }
                if (_this.isArrayGroup(controlModel)
                    && (isNull(findArrayIndex) || controlModel.size > (findArrayIndex))) {
                    var index = (isNull(findArrayIndex)) ? 0 : findArrayIndex;
                    findByIdFn(findId, controlModel.get(index).group, index);
                }
            }
        };
        findByIdFn(id, groupModel, arrayIndex);
        return result;
    };
    FormBuilderService.prototype.clearAllModelsValue = function (groupModel) {
        var _this = this;
        var iterateControlModels = function (findGroupModel) {
            for (var _i = 0, findGroupModel_2 = findGroupModel; _i < findGroupModel_2.length; _i++) {
                var controlModel = findGroupModel_2[_i];
                if (_this.isGroup(controlModel)) {
                    iterateControlModels(controlModel.group);
                    continue;
                }
                if (_this.isArrayGroup(controlModel)) {
                    iterateControlModels(controlModel.groupFactory());
                    continue;
                }
                if (controlModel.hasOwnProperty('valueUpdates')) {
                    controlModel.valueUpdates.next(undefined);
                }
            }
        };
        iterateControlModels(groupModel);
    };
    FormBuilderService.prototype.getValueFromModel = function (groupModel) {
        var _this = this;
        var result = Object.create({});
        var customizer = function (objValue, srcValue) {
            if (Array.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        };
        var normalizeValue = function (controlModel, controlValue, controlModelIndex) {
            var controlLanguage = controlModel.hasLanguages ? controlModel.language : null;
            if (isString(controlValue)) {
                return new FormFieldMetadataValueObject(controlValue, controlLanguage, null, null, controlModelIndex);
            }
            else if (isObject(controlValue)) {
                var authority = controlValue.authority || controlValue.id || null;
                var place = controlModelIndex || controlValue.place;
                if (isNgbDateStruct(controlValue)) {
                    return new FormFieldMetadataValueObject(controlValue, controlLanguage, authority, controlValue, place);
                }
                else {
                    return new FormFieldMetadataValueObject(controlValue.value, controlLanguage, authority, controlValue.display, place, controlValue.confidence);
                }
            }
        };
        var iterateControlModels = function (findGroupModel, controlModelIndex) {
            if (controlModelIndex === void 0) { controlModelIndex = 0; }
            var iterateResult = Object.create({});
            var _loop_1 = function (controlModel) {
                if (_this.isRowGroup(controlModel) && !_this.isCustomOrListGroup(controlModel)) {
                    iterateResult = mergeWith(iterateResult, iterateControlModels(controlModel.group), customizer);
                    return "continue";
                }
                if (_this.isGroup(controlModel) && !_this.isCustomOrListGroup(controlModel)) {
                    iterateResult[controlModel.name] = iterateControlModels(controlModel.group);
                    return "continue";
                }
                if (_this.isRowArrayGroup(controlModel)) {
                    for (var _i = 0, _a = controlModel.groups; _i < _a.length; _i++) {
                        var arrayItemModel = _a[_i];
                        iterateResult = mergeWith(iterateResult, iterateControlModels(arrayItemModel.group, arrayItemModel.index), customizer);
                    }
                    return "continue";
                }
                if (_this.isArrayGroup(controlModel)) {
                    iterateResult[controlModel.name] = [];
                    for (var _b = 0, _c = controlModel.groups; _b < _c.length; _b++) {
                        var arrayItemModel = _c[_b];
                        iterateResult[controlModel.name].push(iterateControlModels(arrayItemModel.group, arrayItemModel.index));
                    }
                    return "continue";
                }
                var controlId = void 0;
                // Get the field's name
                if (_this.isQualdropGroup(controlModel)) {
                    // If is instance of DynamicQualdropModel take the qualdrop id as field's name
                    controlId = controlModel.qualdropId;
                }
                else {
                    controlId = controlModel.name;
                }
                if (_this.isRelationGroup(controlModel)) {
                    var values = controlModel.getGroupValue();
                    values.forEach(function (groupValue, groupIndex) {
                        var newGroupValue = Object.create({});
                        Object.keys(groupValue)
                            .forEach(function (key) {
                            var normValue = normalizeValue(controlModel, groupValue[key], groupIndex);
                            if (isNotEmpty(normValue) && normValue.hasValue()) {
                                if (iterateResult.hasOwnProperty(key)) {
                                    iterateResult[key].push(normValue);
                                }
                                else {
                                    iterateResult[key] = [normValue];
                                }
                            }
                        });
                    });
                }
                else if (isNotUndefined(controlModel.value) && isNotEmpty(controlModel.value)) {
                    var controlArrayValue_1 = [];
                    // Normalize control value as an array of FormFieldMetadataValueObject
                    var values = Array.isArray(controlModel.value) ? controlModel.value : [controlModel.value];
                    values.forEach(function (controlValue) {
                        controlArrayValue_1.push(normalizeValue(controlModel, controlValue, controlModelIndex));
                    });
                    if (controlId && iterateResult.hasOwnProperty(controlId) && isNotNull(iterateResult[controlId])) {
                        iterateResult[controlId] = iterateResult[controlId].concat(controlArrayValue_1);
                    }
                    else {
                        iterateResult[controlId] = isNotEmpty(controlArrayValue_1) ? controlArrayValue_1 : null;
                    }
                }
            };
            // Iterate over all group's controls
            for (var _i = 0, findGroupModel_3 = findGroupModel; _i < findGroupModel_3.length; _i++) {
                var controlModel = findGroupModel_3[_i];
                _loop_1(controlModel);
            }
            return iterateResult;
        };
        result = iterateControlModels(groupModel);
        return result;
    };
    FormBuilderService.prototype.modelFromConfiguration = function (json, scopeUUID, initFormValues, submissionScope, readOnly) {
        if (initFormValues === void 0) { initFormValues = {}; }
        if (readOnly === void 0) { readOnly = false; }
        var rows = [];
        var rawData = typeof json === 'string' ? JSON.parse(json, JSONUtils.parseReviver) : json;
        if (rawData.rows && !isEmpty(rawData.rows)) {
            rawData.rows.forEach(function (currentRow) {
                var rowParsed = new RowParser(currentRow, scopeUUID, initFormValues, submissionScope, readOnly).parse();
                if (isNotNull(rowParsed)) {
                    if (Array.isArray(rowParsed)) {
                        rows = rows.concat(rowParsed);
                    }
                    else {
                        rows.push(rowParsed);
                    }
                }
            });
        }
        return rows;
    };
    FormBuilderService.prototype.isModelInCustomGroup = function (model) {
        return this.isCustomGroup(model.parent);
    };
    FormBuilderService.prototype.hasArrayGroupValue = function (model) {
        return model && (this.isListGroup(model) || model.type === DYNAMIC_FORM_CONTROL_TYPE_TAG);
    };
    FormBuilderService.prototype.hasMappedGroupValue = function (model) {
        return (this.isQualdropGroup(model.parent)
            || this.isRelationGroup(model.parent));
    };
    FormBuilderService.prototype.isGroup = function (model) {
        return model && (model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP || model.type === DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP);
    };
    FormBuilderService.prototype.isQualdropGroup = function (model) {
        return (model && model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && hasValue(model.qualdropId));
    };
    FormBuilderService.prototype.isCustomGroup = function (model) {
        return model && (model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && model.isCustomGroup === true);
    };
    FormBuilderService.prototype.isRowGroup = function (model) {
        return model && (model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && model.isRowGroup === true);
    };
    FormBuilderService.prototype.isCustomOrListGroup = function (model) {
        return model &&
            (this.isCustomGroup(model)
                || this.isListGroup(model));
    };
    FormBuilderService.prototype.isListGroup = function (model) {
        return model &&
            ((model.type === DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP && model.isListGroup === true)
                || (model.type === DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP && model.isListGroup === true));
    };
    FormBuilderService.prototype.isRelationGroup = function (model) {
        return model && model.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP;
    };
    FormBuilderService.prototype.isRowArrayGroup = function (model) {
        return model.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY && model.isRowArray === true;
    };
    FormBuilderService.prototype.isArrayGroup = function (model) {
        return model.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY;
    };
    FormBuilderService.prototype.isInputModel = function (model) {
        return model.type === DYNAMIC_FORM_CONTROL_TYPE_INPUT;
    };
    FormBuilderService.prototype.getFormControlById = function (id, formGroup, groupModel, index) {
        if (index === void 0) { index = 0; }
        var fieldModel = this.findById(id, groupModel, index);
        return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
    };
    FormBuilderService.prototype.getId = function (model) {
        var tempModel;
        if (this.isArrayGroup(model)) {
            return model.index.toString();
        }
        else if (this.isModelInCustomGroup(model)) {
            tempModel = model.parent;
        }
        else {
            tempModel = model;
        }
        return (tempModel.id !== tempModel.name) ? tempModel.name : tempModel.id;
    };
    FormBuilderService = tslib_1.__decorate([
        Injectable()
    ], FormBuilderService);
    return FormBuilderService;
}(DynamicFormService));
export { FormBuilderService };
//# sourceMappingURL=form-builder.service.js.map
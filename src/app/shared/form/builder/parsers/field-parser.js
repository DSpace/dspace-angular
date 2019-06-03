import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../../empty.util';
import { uniqueId } from 'lodash';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicRowArrayModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { setLayout } from './parser.utils';
import { AuthorityOptions } from '../../../../core/integration/models/authority-options.model';
var FieldParser = /** @class */ (function () {
    function FieldParser(configData, initFormValues, parserOptions) {
        this.configData = configData;
        this.initFormValues = initFormValues;
        this.parserOptions = parserOptions;
    }
    FieldParser.prototype.parse = function () {
        var _this = this;
        if (((this.getInitValueCount() > 1 && !this.configData.repeatable) || (this.configData.repeatable))
            && (this.configData.input.type !== 'list')
            && (this.configData.input.type !== 'tag')
            && (this.configData.input.type !== 'group')) {
            var arrayCounter_1 = 0;
            var fieldArrayCounter_1 = 0;
            var config = {
                id: uniqueId() + '_array',
                label: this.configData.label,
                initialCount: this.getInitArrayIndex(),
                notRepeatable: !this.configData.repeatable,
                groupFactory: function () {
                    var model;
                    if ((arrayCounter_1 === 0)) {
                        model = _this.modelFactory();
                        arrayCounter_1++;
                    }
                    else {
                        var fieldArrayOfValueLenght = _this.getInitValueCount(arrayCounter_1 - 1);
                        var fieldValue = null;
                        if (fieldArrayOfValueLenght > 0) {
                            fieldValue = _this.getInitFieldValue(arrayCounter_1 - 1, fieldArrayCounter_1++);
                            if (fieldArrayCounter_1 === fieldArrayOfValueLenght) {
                                fieldArrayCounter_1 = 0;
                                arrayCounter_1++;
                            }
                        }
                        model = _this.modelFactory(fieldValue, false);
                    }
                    setLayout(model, 'element', 'host', 'col');
                    if (model.hasLanguages) {
                        setLayout(model, 'grid', 'control', 'col');
                    }
                    return [model];
                }
            };
            var layout = {
                grid: {
                    group: 'form-row'
                }
            };
            return new DynamicRowArrayModel(config, layout);
        }
        else {
            var model = this.modelFactory(this.getInitFieldValue());
            if (model.hasLanguages) {
                setLayout(model, 'grid', 'control', 'col');
            }
            return model;
        }
    };
    FieldParser.prototype.getInitValueCount = function (index, fieldId) {
        var _this = this;
        if (index === void 0) { index = 0; }
        var fieldIds = fieldId || this.getAllFieldIds();
        if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
            return this.initFormValues[fieldIds[0]].length;
        }
        else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
            var values_1 = [];
            fieldIds.forEach(function (id) {
                if (_this.initFormValues.hasOwnProperty(id)) {
                    values_1.push(_this.initFormValues[id].length);
                }
            });
            return values_1[index];
        }
        else {
            return 0;
        }
    };
    FieldParser.prototype.getInitGroupValues = function () {
        var fieldIds = this.getAllFieldIds();
        if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
            return this.initFormValues[fieldIds[0]];
        }
    };
    FieldParser.prototype.getInitFieldValues = function (fieldId) {
        if (isNotEmpty(this.initFormValues) && isNotNull(fieldId) && this.initFormValues.hasOwnProperty(fieldId)) {
            return this.initFormValues[fieldId];
        }
    };
    FieldParser.prototype.getInitFieldValue = function (outerIndex, innerIndex, fieldId) {
        var _this = this;
        if (outerIndex === void 0) { outerIndex = 0; }
        if (innerIndex === void 0) { innerIndex = 0; }
        var fieldIds = fieldId || this.getAllFieldIds();
        if (isNotEmpty(this.initFormValues)
            && isNotNull(fieldIds)
            && fieldIds.length === 1
            && this.initFormValues.hasOwnProperty(fieldIds[outerIndex])
            && this.initFormValues[fieldIds[outerIndex]].length > innerIndex) {
            return this.initFormValues[fieldIds[outerIndex]][innerIndex];
        }
        else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
            var values_2 = [];
            fieldIds.forEach(function (id) {
                if (_this.initFormValues.hasOwnProperty(id)) {
                    var valueObj = Object.assign(new FormFieldMetadataValueObject(), _this.initFormValues[id][innerIndex]);
                    valueObj.metadata = id;
                    // valueObj.value = this.initFormValues[id][innerIndex];
                    values_2.push(valueObj);
                }
            });
            return values_2[outerIndex];
        }
        else {
            return null;
        }
    };
    FieldParser.prototype.getInitArrayIndex = function () {
        var _this = this;
        var fieldIds = this.getAllFieldIds();
        if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds)) {
            return this.initFormValues[fieldIds].length;
        }
        else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
            var counter_1 = 0;
            fieldIds.forEach(function (id) {
                if (_this.initFormValues.hasOwnProperty(id)) {
                    counter_1 = counter_1 + _this.initFormValues[id].length;
                }
            });
            return (counter_1 === 0) ? 1 : counter_1;
        }
        else {
            return 1;
        }
    };
    FieldParser.prototype.getFieldId = function () {
        var ids = this.getAllFieldIds();
        return isNotNull(ids) ? ids[0] : null;
    };
    FieldParser.prototype.getAllFieldIds = function () {
        if (Array.isArray(this.configData.selectableMetadata)) {
            if (this.configData.selectableMetadata.length === 1) {
                return [this.configData.selectableMetadata[0].metadata];
            }
            else {
                var ids_1 = [];
                this.configData.selectableMetadata.forEach(function (entry) { return ids_1.push(entry.metadata); });
                return ids_1;
            }
        }
        else {
            return null;
        }
    };
    FieldParser.prototype.initModel = function (id, label, labelEmpty, setErrors) {
        if (label === void 0) { label = true; }
        if (labelEmpty === void 0) { labelEmpty = false; }
        if (setErrors === void 0) { setErrors = true; }
        var controlModel = Object.create(null);
        // Sets input ID
        this.fieldId = id ? id : this.getFieldId();
        // Sets input name (with the original field's id value)
        controlModel.name = this.fieldId;
        // input ID doesn't allow dots, so replace them
        controlModel.id = (this.fieldId).replace(/\./g, '_');
        // Set read only option
        controlModel.readOnly = this.parserOptions.readOnly;
        controlModel.disabled = this.parserOptions.readOnly;
        // Set label
        this.setLabel(controlModel, label, labelEmpty);
        controlModel.placeholder = this.configData.label;
        if (this.configData.mandatory && setErrors) {
            this.markAsRequired(controlModel);
        }
        if (this.hasRegex()) {
            this.addPatternValidator(controlModel);
        }
        // Available Languages
        if (this.configData.languageCodes && this.configData.languageCodes.length > 0) {
            controlModel.languageCodes = this.configData.languageCodes;
        }
        /*    (controlModel as DsDynamicInputModel).languageCodes = [{
                display: 'English',
                code: 'en_US'
              },
              {
                display: 'Italian',
                code: 'it_IT'
              }];*/
        return controlModel;
    };
    FieldParser.prototype.hasRegex = function () {
        return hasValue(this.configData.input.regex);
    };
    FieldParser.prototype.addPatternValidator = function (controlModel) {
        var regex = new RegExp(this.configData.input.regex);
        controlModel.validators = Object.assign({}, controlModel.validators, { pattern: regex });
        controlModel.errorMessages = Object.assign({}, controlModel.errorMessages, { pattern: 'error.validation.pattern' });
    };
    FieldParser.prototype.markAsRequired = function (controlModel) {
        controlModel.required = true;
        controlModel.validators = Object.assign({}, controlModel.validators, { required: null });
        controlModel.errorMessages = Object.assign({}, controlModel.errorMessages, { required: this.configData.mandatoryMessage });
    };
    FieldParser.prototype.setLabel = function (controlModel, label, labelEmpty) {
        if (label === void 0) { label = true; }
        if (labelEmpty === void 0) { labelEmpty = false; }
        if (label) {
            controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
        }
    };
    FieldParser.prototype.setOptions = function (controlModel) {
        // Checks if field has multiple values and sets options available
        if (isNotUndefined(this.configData.selectableMetadata) && this.configData.selectableMetadata.length > 1) {
            controlModel.options = [];
            this.configData.selectableMetadata.forEach(function (option, key) {
                if (key === 0) {
                    controlModel.value = option.metadata;
                }
                controlModel.options.push({ label: option.label, value: option.metadata });
            });
        }
    };
    FieldParser.prototype.setAuthorityOptions = function (controlModel, authorityUuid) {
        if (isNotEmpty(this.configData.selectableMetadata[0].authority)) {
            controlModel.authorityOptions = new AuthorityOptions(this.configData.selectableMetadata[0].authority, this.configData.selectableMetadata[0].metadata, authorityUuid, this.configData.selectableMetadata[0].closed);
        }
    };
    FieldParser.prototype.setValues = function (modelConfig, fieldValue, forceValueAsObj, groupModel) {
        if (forceValueAsObj === void 0) { forceValueAsObj = false; }
        if (isNotEmpty(fieldValue)) {
            if (groupModel) {
                // Array, values is an array
                modelConfig.value = this.getInitGroupValues();
                if (Array.isArray(modelConfig.value) && modelConfig.value.length > 0 && modelConfig.value[0].language) {
                    // Array Item has language, ex. AuthorityModel
                    modelConfig.language = modelConfig.value[0].language;
                }
                return;
            }
            if (typeof fieldValue === 'object') {
                modelConfig.language = fieldValue.language;
                if (forceValueAsObj) {
                    modelConfig.value = fieldValue;
                }
                else {
                    modelConfig.value = fieldValue.value;
                }
            }
            else {
                if (forceValueAsObj) {
                    // If value isn't an instance of FormFieldMetadataValueObject instantiate it
                    modelConfig.value = new FormFieldMetadataValueObject(fieldValue);
                }
                else {
                    if (typeof fieldValue === 'string') {
                        // Case only string
                        modelConfig.value = fieldValue;
                    }
                }
            }
        }
        return modelConfig;
    };
    return FieldParser;
}());
export { FieldParser };
//# sourceMappingURL=field-parser.js.map
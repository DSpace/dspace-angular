import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY } from '@ng-dynamic-forms/core';
import { uniqueId } from 'lodash';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '../ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { isEmpty } from '../../../empty.util';
import { setLayout } from './parser.utils';
import { ParserFactory } from './parser-factory';
export var ROW_ID_PREFIX = 'df-row-group-config-';
var RowParser = /** @class */ (function () {
    function RowParser(rowData, scopeUUID, initFormValues, submissionScope, readOnly) {
        this.rowData = rowData;
        this.scopeUUID = scopeUUID;
        this.initFormValues = initFormValues;
        this.submissionScope = submissionScope;
        this.readOnly = readOnly;
        this.authorityOptions = new IntegrationSearchOptions(scopeUUID);
    }
    RowParser.prototype.parse = function () {
        var _this = this;
        var fieldModel = null;
        var parsedResult = null;
        var config = {
            id: uniqueId(ROW_ID_PREFIX),
            group: [],
        };
        var scopedFields = this.filterScopedFields(this.rowData.fields);
        var layoutDefaultGridClass = ' col-sm-' + Math.trunc(12 / scopedFields.length);
        var layoutClass = ' d-flex flex-column justify-content-start';
        var parserOptions = {
            readOnly: this.readOnly,
            submissionScope: this.submissionScope,
            authorityUuid: this.authorityOptions.uuid
        };
        // Iterate over row's fields
        scopedFields.forEach(function (fieldData) {
            var layoutFieldClass = (fieldData.style || layoutDefaultGridClass) + layoutClass;
            var parserCo = ParserFactory.getConstructor(fieldData.input.type);
            if (parserCo) {
                fieldModel = new parserCo(fieldData, _this.initFormValues, parserOptions).parse();
            }
            else {
                throw new Error("unknown form control model type \"" + fieldData.input.type + "\" defined for Input field with label \"" + fieldData.label + "\".");
            }
            if (fieldModel) {
                if (fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY || fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP) {
                    if (_this.rowData.fields.length > 1) {
                        setLayout(fieldModel, 'grid', 'host', layoutFieldClass);
                        config.group.push(fieldModel);
                        // if (isEmpty(parsedResult)) {
                        //   parsedResult = [];
                        // }
                        // parsedResult.push(fieldModel);
                    }
                    else {
                        parsedResult = fieldModel;
                    }
                    return;
                }
                else {
                    if (Array.isArray(fieldModel)) {
                        fieldModel.forEach(function (model) {
                            parsedResult = model;
                            return;
                        });
                    }
                    else {
                        setLayout(fieldModel, 'grid', 'host', layoutFieldClass);
                        config.group.push(fieldModel);
                    }
                }
                fieldModel = null;
            }
        });
        if (config && !isEmpty(config.group)) {
            var clsGroup = {
                element: {
                    control: 'form-row',
                }
            };
            var groupModel = new DynamicRowGroupModel(config, clsGroup);
            if (Array.isArray(parsedResult)) {
                parsedResult.push(groupModel);
            }
            else {
                parsedResult = groupModel;
            }
        }
        return parsedResult;
    };
    RowParser.prototype.checksFieldScope = function (fieldScope) {
        return (isEmpty(fieldScope) || isEmpty(this.submissionScope) || fieldScope === this.submissionScope);
    };
    RowParser.prototype.filterScopedFields = function (fields) {
        var _this = this;
        var filteredFields = [];
        fields.forEach(function (field) {
            // Whether field scope doesn't match the submission scope, skip it
            if (_this.checksFieldScope(field.scope)) {
                filteredFields.push(field);
            }
        });
        return filteredFields;
    };
    return RowParser;
}());
export { RowParser };
//# sourceMappingURL=row-parser.js.map
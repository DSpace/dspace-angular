import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { isNotEmpty } from '../../../empty.util';
import { DynamicRelationGroupModel, PLACEHOLDER_PARENT_METADATA } from '../ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
var RelationGroupFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(RelationGroupFieldParser, _super);
    function RelationGroupFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelationGroupFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var _this = this;
        var modelConfiguration = this.initModel(null, label);
        modelConfiguration.scopeUUID = this.parserOptions.authorityUuid;
        modelConfiguration.submissionScope = this.parserOptions.submissionScope;
        if (this.configData && this.configData.rows && this.configData.rows.length > 0) {
            modelConfiguration.formConfiguration = this.configData.rows;
            modelConfiguration.relationFields = [];
            this.configData.rows.forEach(function (row) {
                row.fields.forEach(function (field) {
                    if (field.selectableMetadata[0].metadata === _this.configData.selectableMetadata[0].metadata) {
                        if (!field.mandatory) {
                            // throw new Error(`Configuration not valid: Main field ${this.configData.selectableMetadata[0].metadata} may be mandatory`);
                        }
                        modelConfiguration.mandatoryField = _this.configData.selectableMetadata[0].metadata;
                    }
                    else {
                        modelConfiguration.relationFields.push(field.selectableMetadata[0].metadata);
                    }
                });
            });
        }
        else {
            throw new Error("Configuration not valid: " + modelConfiguration.name);
        }
        if (isNotEmpty(this.getInitGroupValues())) {
            modelConfiguration.value = [];
            var mandatoryFieldEntries = this.getInitFieldValues(modelConfiguration.mandatoryField);
            mandatoryFieldEntries.forEach(function (entry, index) {
                var item = Object.create(null);
                var listFields = [modelConfiguration.mandatoryField].concat(modelConfiguration.relationFields);
                listFields.forEach(function (fieldId) {
                    var value = _this.getInitFieldValue(0, index, [fieldId]);
                    item[fieldId] = isNotEmpty(value) ? value : PLACEHOLDER_PARENT_METADATA;
                });
                modelConfiguration.value.push(item);
            });
        }
        var cls = {
            element: {
                container: 'mb-3'
            }
        };
        var model = new DynamicRelationGroupModel(modelConfiguration, cls);
        model.name = this.getFieldId();
        return model;
    };
    return RelationGroupFieldParser;
}(FieldParser));
export { RelationGroupFieldParser };
//# sourceMappingURL=relation-group-field-parser.js.map
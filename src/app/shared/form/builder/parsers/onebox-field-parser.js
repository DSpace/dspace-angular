import * as tslib_1 from "tslib";
import { DynamicSelectModel } from '@ng-dynamic-forms/core';
import { FieldParser } from './field-parser';
import { DynamicQualdropModel, QUALDROP_GROUP_SUFFIX, QUALDROP_METADATA_SUFFIX, QUALDROP_VALUE_SUFFIX } from '../ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { isNotEmpty } from '../../../empty.util';
import { DsDynamicInputModel } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DynamicTypeaheadModel } from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
var OneboxFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(OneboxFieldParser, _super);
    function OneboxFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneboxFieldParser.prototype.modelFactory = function (fieldValue, label) {
        if (this.configData.selectableMetadata.length > 1) {
            // Case Qualdrop Model
            var clsGroup = {
                element: {
                    control: 'form-row',
                }
            };
            var clsSelect = {
                element: {
                    control: 'ds-form-input-addon custom-select',
                },
                grid: {
                    host: 'col-sm-4 pr-0'
                }
            };
            var clsInput = {
                element: {
                    control: 'ds-form-input-value',
                },
                grid: {
                    host: 'col-sm-8 pl-0'
                }
            };
            var newId = this.configData.selectableMetadata[0].metadata
                .split('.')
                .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
                .join('.');
            var inputSelectGroup = Object.create(null);
            inputSelectGroup.id = newId.replace(/\./g, '_') + QUALDROP_GROUP_SUFFIX;
            inputSelectGroup.group = [];
            inputSelectGroup.legend = this.configData.label;
            var selectModelConfig = this.initModel(newId + QUALDROP_METADATA_SUFFIX, label);
            this.setOptions(selectModelConfig);
            if (isNotEmpty(fieldValue)) {
                selectModelConfig.value = fieldValue.metadata;
            }
            inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, clsSelect));
            var inputModelConfig = this.initModel(newId + QUALDROP_VALUE_SUFFIX, label, true);
            this.setValues(inputModelConfig, fieldValue);
            inputSelectGroup.readOnly = selectModelConfig.disabled && inputModelConfig.readOnly;
            inputSelectGroup.group.push(new DsDynamicInputModel(inputModelConfig, clsInput));
            return new DynamicQualdropModel(inputSelectGroup, clsGroup);
        }
        else if (this.configData.selectableMetadata[0].authority) {
            var typeaheadModelConfig = this.initModel(null, label);
            this.setAuthorityOptions(typeaheadModelConfig, this.parserOptions.authorityUuid);
            this.setValues(typeaheadModelConfig, fieldValue, true);
            return new DynamicTypeaheadModel(typeaheadModelConfig);
        }
        else {
            var inputModelConfig = this.initModel(null, label);
            this.setValues(inputModelConfig, fieldValue);
            return new DsDynamicInputModel(inputModelConfig);
        }
    };
    return OneboxFieldParser;
}(FieldParser));
export { OneboxFieldParser };
//# sourceMappingURL=onebox-field-parser.js.map
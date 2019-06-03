import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicInputModel } from '@ng-dynamic-forms/core';
import { CONCAT_FIRST_INPUT_SUFFIX, CONCAT_GROUP_SUFFIX, CONCAT_SECOND_INPUT_SUFFIX, DynamicConcatModel } from '../ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { isNotEmpty } from '../../../empty.util';
var ConcatFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(ConcatFieldParser, _super);
    function ConcatFieldParser(configData, initFormValues, parserOptions, separator, firstPlaceholder, secondPlaceholder) {
        if (firstPlaceholder === void 0) { firstPlaceholder = null; }
        if (secondPlaceholder === void 0) { secondPlaceholder = null; }
        var _this = _super.call(this, configData, initFormValues, parserOptions) || this;
        _this.configData = configData;
        _this.initFormValues = initFormValues;
        _this.parserOptions = parserOptions;
        _this.separator = separator;
        _this.firstPlaceholder = firstPlaceholder;
        _this.secondPlaceholder = secondPlaceholder;
        _this.separator = separator;
        _this.firstPlaceholder = firstPlaceholder;
        _this.secondPlaceholder = secondPlaceholder;
        return _this;
    }
    ConcatFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var clsGroup;
        var clsInput;
        var id = this.configData.selectableMetadata[0].metadata;
        clsInput = {
            grid: {
                host: 'col-sm-6'
            }
        };
        var groupId = id.replace(/\./g, '_') + CONCAT_GROUP_SUFFIX;
        var concatGroup = this.initModel(groupId, false, false);
        concatGroup.group = [];
        concatGroup.separator = this.separator;
        var input1ModelConfig = this.initModel(id + CONCAT_FIRST_INPUT_SUFFIX, label, false, false);
        var input2ModelConfig = this.initModel(id + CONCAT_SECOND_INPUT_SUFFIX, label, true, false);
        if (this.configData.mandatory) {
            input1ModelConfig.required = true;
        }
        if (isNotEmpty(this.firstPlaceholder)) {
            input1ModelConfig.placeholder = this.firstPlaceholder;
        }
        if (isNotEmpty(this.secondPlaceholder)) {
            input2ModelConfig.placeholder = this.secondPlaceholder;
        }
        // Split placeholder if is like 'placeholder1/placeholder2'
        var placeholder = this.configData.label.split('/');
        if (placeholder.length === 2) {
            input1ModelConfig.placeholder = placeholder[0];
            input2ModelConfig.placeholder = placeholder[1];
        }
        var model1 = new DynamicInputModel(input1ModelConfig, clsInput);
        var model2 = new DynamicInputModel(input2ModelConfig, clsInput);
        concatGroup.group.push(model1);
        concatGroup.group.push(model2);
        clsGroup = {
            element: {
                control: 'form-row',
            }
        };
        var concatModel = new DynamicConcatModel(concatGroup, clsGroup);
        concatModel.name = this.getFieldId();
        // Init values
        if (isNotEmpty(fieldValue)) {
            concatModel.value = fieldValue;
        }
        return concatModel;
    };
    return ConcatFieldParser;
}(FieldParser));
export { ConcatFieldParser };
//# sourceMappingURL=concat-field-parser.js.map
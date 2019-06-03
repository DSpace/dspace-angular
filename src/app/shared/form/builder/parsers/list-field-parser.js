import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { isNotEmpty } from '../../../empty.util';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicListCheckboxGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';
var ListFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(ListFieldParser, _super);
    function ListFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var listModelConfig = this.initModel(null, label);
        listModelConfig.repeatable = this.configData.repeatable;
        if (this.configData.selectableMetadata[0].authority
            && this.configData.selectableMetadata[0].authority.length > 0) {
            if (isNotEmpty(this.getInitGroupValues())) {
                listModelConfig.value = [];
                this.getInitGroupValues().forEach(function (value) {
                    if (value instanceof FormFieldMetadataValueObject) {
                        listModelConfig.value.push(value);
                    }
                    else {
                        var valueObj = new FormFieldMetadataValueObject(value);
                        listModelConfig.value.push(valueObj);
                    }
                });
            }
            this.setAuthorityOptions(listModelConfig, this.parserOptions.authorityUuid);
        }
        var listModel;
        if (listModelConfig.repeatable) {
            listModelConfig.group = [];
            listModel = new DynamicListCheckboxGroupModel(listModelConfig);
        }
        else {
            listModelConfig.options = [];
            listModel = new DynamicListRadioGroupModel(listModelConfig);
        }
        return listModel;
    };
    return ListFieldParser;
}(FieldParser));
export { ListFieldParser };
//# sourceMappingURL=list-field-parser.js.map
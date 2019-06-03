import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicScrollableDropdownModel } from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { isNotEmpty } from '../../../empty.util';
var DropdownFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(DropdownFieldParser, _super);
    function DropdownFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropdownFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var dropdownModelConfig = this.initModel(null, label);
        var layout;
        if (isNotEmpty(this.configData.selectableMetadata[0].authority)) {
            this.setAuthorityOptions(dropdownModelConfig, this.parserOptions.authorityUuid);
            if (isNotEmpty(fieldValue)) {
                dropdownModelConfig.value = fieldValue;
            }
            layout = {
                element: {
                    control: 'col'
                },
                grid: {
                    host: 'col'
                }
            };
            var dropdownModel = new DynamicScrollableDropdownModel(dropdownModelConfig, layout);
            return dropdownModel;
        }
        else {
            throw Error("Authority name is not available. Please checks form configuration file.");
        }
    };
    return DropdownFieldParser;
}(FieldParser));
export { DropdownFieldParser };
//# sourceMappingURL=dropdown-field-parser.js.map
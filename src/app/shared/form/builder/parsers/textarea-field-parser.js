import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DsDynamicTextAreaModel } from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
var TextareaFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(TextareaFieldParser, _super);
    function TextareaFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextareaFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var textAreaModelConfig = this.initModel(null, label);
        var layout;
        layout = {
            element: {
                label: 'col-form-label'
            }
        };
        textAreaModelConfig.rows = 10;
        this.setValues(textAreaModelConfig, fieldValue);
        var textAreaModel = new DsDynamicTextAreaModel(textAreaModelConfig, layout);
        return textAreaModel;
    };
    return TextareaFieldParser;
}(FieldParser));
export { TextareaFieldParser };
//# sourceMappingURL=textarea-field-parser.js.map
import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicTagModel } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
var TagFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(TagFieldParser, _super);
    function TagFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var tagModelConfig = this.initModel(null, label);
        if (this.configData.selectableMetadata[0].authority
            && this.configData.selectableMetadata[0].authority.length > 0) {
            this.setAuthorityOptions(tagModelConfig, this.parserOptions.authorityUuid);
        }
        this.setValues(tagModelConfig, fieldValue, null, true);
        var tagModel = new DynamicTagModel(tagModelConfig);
        return tagModel;
    };
    return TagFieldParser;
}(FieldParser));
export { TagFieldParser };
//# sourceMappingURL=tag-field-parser.js.map
import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicLookupModel } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';
var LookupFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(LookupFieldParser, _super);
    function LookupFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LookupFieldParser.prototype.modelFactory = function (fieldValue, label) {
        if (this.configData.selectableMetadata[0].authority) {
            var lookupModelConfig = this.initModel(null, label);
            this.setAuthorityOptions(lookupModelConfig, this.parserOptions.authorityUuid);
            this.setValues(lookupModelConfig, fieldValue, true);
            return new DynamicLookupModel(lookupModelConfig);
        }
    };
    return LookupFieldParser;
}(FieldParser));
export { LookupFieldParser };
//# sourceMappingURL=lookup-field-parser.js.map
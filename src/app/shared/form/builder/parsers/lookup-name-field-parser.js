import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicLookupNameModel } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup-name.model';
var LookupNameFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(LookupNameFieldParser, _super);
    function LookupNameFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LookupNameFieldParser.prototype.modelFactory = function (fieldValue, label) {
        if (this.configData.selectableMetadata[0].authority) {
            var lookupModelConfig = this.initModel(null, label);
            this.setAuthorityOptions(lookupModelConfig, this.parserOptions.authorityUuid);
            this.setValues(lookupModelConfig, fieldValue, true);
            return new DynamicLookupNameModel(lookupModelConfig);
        }
    };
    return LookupNameFieldParser;
}(FieldParser));
export { LookupNameFieldParser };
//# sourceMappingURL=lookup-name-field-parser.js.map
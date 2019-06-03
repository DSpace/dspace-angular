import * as tslib_1 from "tslib";
import { ConcatFieldParser } from './concat-field-parser';
var NameFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(NameFieldParser, _super);
    function NameFieldParser(configData, initFormValues, parserOptions) {
        var _this = _super.call(this, configData, initFormValues, parserOptions, ',', 'form.last-name', 'form.first-name') || this;
        _this.configData = configData;
        _this.initFormValues = initFormValues;
        _this.parserOptions = parserOptions;
        return _this;
    }
    return NameFieldParser;
}(ConcatFieldParser));
export { NameFieldParser };
//# sourceMappingURL=name-field-parser.js.map
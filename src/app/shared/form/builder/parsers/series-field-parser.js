import * as tslib_1 from "tslib";
import { ConcatFieldParser } from './concat-field-parser';
var SeriesFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(SeriesFieldParser, _super);
    function SeriesFieldParser(configData, initFormValues, parserOptions) {
        var _this = _super.call(this, configData, initFormValues, parserOptions, ';') || this;
        _this.configData = configData;
        _this.initFormValues = initFormValues;
        _this.parserOptions = parserOptions;
        return _this;
    }
    return SeriesFieldParser;
}(ConcatFieldParser));
export { SeriesFieldParser };
//# sourceMappingURL=series-field-parser.js.map
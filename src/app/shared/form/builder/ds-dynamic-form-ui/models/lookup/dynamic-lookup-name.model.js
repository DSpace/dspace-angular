import * as tslib_1 from "tslib";
import { serializable } from '@ng-dynamic-forms/core';
import { DynamicLookupModel } from './dynamic-lookup.model';
export var DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME = 'LOOKUP_NAME';
var DynamicLookupNameModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicLookupNameModel, _super);
    function DynamicLookupNameModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME;
        _this.separator = config.separator || ',';
        _this.placeholder = config.firstPlaceholder || 'form.last-name';
        _this.secondPlaceholder = config.secondPlaceholder || 'form.first-name';
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicLookupNameModel.prototype, "separator", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicLookupNameModel.prototype, "secondPlaceholder", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicLookupNameModel.prototype, "type", void 0);
    return DynamicLookupNameModel;
}(DynamicLookupModel));
export { DynamicLookupNameModel };
//# sourceMappingURL=dynamic-lookup-name.model.js.map
import * as tslib_1 from "tslib";
import { AUTOCOMPLETE_OFF, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
export var DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';
var DynamicLookupModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicLookupModel, _super);
    function DynamicLookupModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;
        _this.autoComplete = AUTOCOMPLETE_OFF;
        _this.maxOptions = config.maxOptions || 10;
        _this.valueUpdates.next(config.value);
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicLookupModel.prototype, "maxOptions", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicLookupModel.prototype, "type", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Object)
    ], DynamicLookupModel.prototype, "value", void 0);
    return DynamicLookupModel;
}(DsDynamicInputModel));
export { DynamicLookupModel };
//# sourceMappingURL=dynamic-lookup.model.js.map
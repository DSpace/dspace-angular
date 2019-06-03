import * as tslib_1 from "tslib";
import { AUTOCOMPLETE_OFF, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
export var DYNAMIC_FORM_CONTROL_TYPE_TAG = 'TAG';
var DynamicTagModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicTagModel, _super);
    function DynamicTagModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_TAG;
        _this.autoComplete = AUTOCOMPLETE_OFF;
        _this.minChars = config.minChars || 3;
        var value = config.value || [];
        _this.valueUpdates.next(value);
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicTagModel.prototype, "minChars", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicTagModel.prototype, "value", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicTagModel.prototype, "type", void 0);
    return DynamicTagModel;
}(DsDynamicInputModel));
export { DynamicTagModel };
//# sourceMappingURL=dynamic-tag.model.js.map
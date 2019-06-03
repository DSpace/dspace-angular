import * as tslib_1 from "tslib";
import { DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
var DsDynamicTextAreaModel = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicTextAreaModel, _super);
    function DsDynamicTextAreaModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA;
        _this.cols = config.cols;
        _this.rows = config.rows;
        _this.wrap = config.wrap;
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DsDynamicTextAreaModel.prototype, "cols", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DsDynamicTextAreaModel.prototype, "rows", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DsDynamicTextAreaModel.prototype, "wrap", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicTextAreaModel.prototype, "type", void 0);
    return DsDynamicTextAreaModel;
}(DsDynamicInputModel));
export { DsDynamicTextAreaModel };
//# sourceMappingURL=ds-dynamic-textarea.model.js.map
import * as tslib_1 from "tslib";
import { DynamicFormArrayModel, serializable } from '@ng-dynamic-forms/core';
var DynamicRowArrayModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicRowArrayModel, _super);
    function DynamicRowArrayModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.notRepeatable = false;
        _this.isRowArray = true;
        _this.notRepeatable = config.notRepeatable;
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Object)
    ], DynamicRowArrayModel.prototype, "notRepeatable", void 0);
    return DynamicRowArrayModel;
}(DynamicFormArrayModel));
export { DynamicRowArrayModel };
//# sourceMappingURL=ds-dynamic-row-array-model.js.map
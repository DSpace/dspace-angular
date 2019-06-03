import * as tslib_1 from "tslib";
import { DynamicDateControlModel, serializable } from '@ng-dynamic-forms/core';
export var DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';
/**
 * Dynamic Date Picker Model class
 */
var DynamicDsDatePickerModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicDsDatePickerModel, _super);
    function DynamicDsDatePickerModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
        _this.hasLanguages = false;
        _this.malformedDate = false;
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicDsDatePickerModel.prototype, "type", void 0);
    return DynamicDsDatePickerModel;
}(DynamicDateControlModel));
export { DynamicDsDatePickerModel };
//# sourceMappingURL=date-picker.model.js.map
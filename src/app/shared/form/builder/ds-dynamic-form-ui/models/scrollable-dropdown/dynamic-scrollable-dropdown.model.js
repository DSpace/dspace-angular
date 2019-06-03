import * as tslib_1 from "tslib";
import { AUTOCOMPLETE_OFF, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
export var DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN = 'SCROLLABLE_DROPDOWN';
var DynamicScrollableDropdownModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicScrollableDropdownModel, _super);
    function DynamicScrollableDropdownModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN;
        _this.autoComplete = AUTOCOMPLETE_OFF;
        _this.authorityOptions = config.authorityOptions;
        _this.maxOptions = config.maxOptions || 10;
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicScrollableDropdownModel.prototype, "maxOptions", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicScrollableDropdownModel.prototype, "type", void 0);
    return DynamicScrollableDropdownModel;
}(DsDynamicInputModel));
export { DynamicScrollableDropdownModel };
//# sourceMappingURL=dynamic-scrollable-dropdown.model.js.map
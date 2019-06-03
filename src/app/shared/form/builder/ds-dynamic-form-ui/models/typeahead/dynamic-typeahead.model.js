import * as tslib_1 from "tslib";
import { AUTOCOMPLETE_OFF, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
export var DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD = 'TYPEAHEAD';
var DynamicTypeaheadModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicTypeaheadModel, _super);
    function DynamicTypeaheadModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD;
        _this.autoComplete = AUTOCOMPLETE_OFF;
        _this.minChars = config.minChars || 3;
        return _this;
    }
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicTypeaheadModel.prototype, "minChars", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicTypeaheadModel.prototype, "type", void 0);
    return DynamicTypeaheadModel;
}(DsDynamicInputModel));
export { DynamicTypeaheadModel };
//# sourceMappingURL=dynamic-typeahead.model.js.map
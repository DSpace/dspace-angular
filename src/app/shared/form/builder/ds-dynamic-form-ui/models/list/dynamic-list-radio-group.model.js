import * as tslib_1 from "tslib";
import { DynamicRadioGroupModel, serializable } from '@ng-dynamic-forms/core';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../../empty.util';
var DynamicListRadioGroupModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicListRadioGroupModel, _super);
    function DynamicListRadioGroupModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.isListGroup = true;
        _this.authorityOptions = config.authorityOptions;
        _this.groupLength = config.groupLength || 5;
        _this.repeatable = config.repeatable;
        _this.valueUpdates.next(config.value);
        return _this;
    }
    Object.defineProperty(DynamicListRadioGroupModel.prototype, "hasAuthority", {
        get: function () {
            return this.authorityOptions && hasValue(this.authorityOptions.name);
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", AuthorityOptions)
    ], DynamicListRadioGroupModel.prototype, "authorityOptions", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Boolean)
    ], DynamicListRadioGroupModel.prototype, "repeatable", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicListRadioGroupModel.prototype, "groupLength", void 0);
    return DynamicListRadioGroupModel;
}(DynamicRadioGroupModel));
export { DynamicListRadioGroupModel };
//# sourceMappingURL=dynamic-list-radio-group.model.js.map
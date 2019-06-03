import * as tslib_1 from "tslib";
import { Subject } from 'rxjs';
import { DynamicCheckboxGroupModel, serializable } from '@ng-dynamic-forms/core';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../../empty.util';
var DynamicListCheckboxGroupModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicListCheckboxGroupModel, _super);
    function DynamicListCheckboxGroupModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.isListGroup = true;
        _this.authorityOptions = config.authorityOptions;
        _this.groupLength = config.groupLength || 5;
        _this._value = [];
        _this.repeatable = config.repeatable;
        _this.valueUpdates = new Subject();
        _this.valueUpdates.subscribe(function (value) { return _this.value = value; });
        _this.valueUpdates.next(config.value);
        return _this;
    }
    Object.defineProperty(DynamicListCheckboxGroupModel.prototype, "hasAuthority", {
        get: function () {
            return this.authorityOptions && hasValue(this.authorityOptions.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicListCheckboxGroupModel.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (value) {
                if (Array.isArray(value)) {
                    this._value = value;
                }
                else {
                    // _value is non extendible so assign it a new array
                    var newValue = this.value.concat([value]);
                    this._value = newValue;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", AuthorityOptions)
    ], DynamicListCheckboxGroupModel.prototype, "authorityOptions", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Boolean)
    ], DynamicListCheckboxGroupModel.prototype, "repeatable", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Number)
    ], DynamicListCheckboxGroupModel.prototype, "groupLength", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicListCheckboxGroupModel.prototype, "_value", void 0);
    return DynamicListCheckboxGroupModel;
}(DynamicCheckboxGroupModel));
export { DynamicListCheckboxGroupModel };
//# sourceMappingURL=dynamic-list-checkbox-group.model.js.map
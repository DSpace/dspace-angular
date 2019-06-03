import * as tslib_1 from "tslib";
import { DynamicFormGroupModel, serializable } from '@ng-dynamic-forms/core';
import { isNotEmpty } from '../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
export var CONCAT_GROUP_SUFFIX = '_CONCAT_GROUP';
export var CONCAT_FIRST_INPUT_SUFFIX = '_CONCAT_FIRST_INPUT';
export var CONCAT_SECOND_INPUT_SUFFIX = '_CONCAT_SECOND_INPUT';
var DynamicConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicConcatModel, _super);
    function DynamicConcatModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.hasLanguages = false;
        _this.isCustomGroup = true;
        _this.separator = config.separator + ' ';
        return _this;
    }
    Object.defineProperty(DynamicConcatModel.prototype, "value", {
        get: function () {
            var firstValue = this.get(0).value;
            var secondValue = this.get(1).value;
            if (isNotEmpty(firstValue) && isNotEmpty(secondValue)) {
                return new FormFieldMetadataValueObject(firstValue + this.separator + secondValue);
            }
            else if (isNotEmpty(firstValue)) {
                return new FormFieldMetadataValueObject(firstValue);
            }
            else {
                return null;
            }
        },
        set: function (value) {
            var values;
            var tempValue;
            if (typeof value === 'string') {
                tempValue = value;
            }
            else {
                tempValue = value.value;
            }
            if (tempValue.includes(this.separator)) {
                values = tempValue.split(this.separator);
            }
            else {
                values = [tempValue, null];
            }
            if (values[0]) {
                this.get(0).valueUpdates.next(values[0]);
            }
            if (values[1]) {
                this.get(1).valueUpdates.next(values[1]);
            }
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicConcatModel.prototype, "separator", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Object)
    ], DynamicConcatModel.prototype, "hasLanguages", void 0);
    return DynamicConcatModel;
}(DynamicFormGroupModel));
export { DynamicConcatModel };
//# sourceMappingURL=ds-dynamic-concat.model.js.map
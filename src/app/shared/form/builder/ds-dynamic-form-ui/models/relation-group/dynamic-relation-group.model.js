import * as tslib_1 from "tslib";
import { serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
import { isEmpty, isNull } from '../../../../../empty.util';
export var DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP = 'RELATION';
export var PLACEHOLDER_PARENT_METADATA = '#PLACEHOLDER_PARENT_METADATA_VALUE#';
/**
 * Dynamic Group Model class
 */
var DynamicRelationGroupModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicRelationGroupModel, _super);
    function DynamicRelationGroupModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.type = DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP;
        _this.formConfiguration = config.formConfiguration;
        _this.mandatoryField = config.mandatoryField;
        _this.relationFields = config.relationFields;
        _this.scopeUUID = config.scopeUUID;
        _this.submissionScope = config.submissionScope;
        var value = config.value || [];
        _this.valueUpdates.next(value);
        return _this;
    }
    Object.defineProperty(DynamicRelationGroupModel.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = (isEmpty(value)) ? null : value;
        },
        enumerable: true,
        configurable: true
    });
    DynamicRelationGroupModel.prototype.isEmpty = function () {
        var value = this.getGroupValue();
        return (value.length === 1 && isNull(value[0][this.mandatoryField]));
    };
    DynamicRelationGroupModel.prototype.getGroupValue = function () {
        if (isEmpty(this._value)) {
            // If items is empty, last element has been removed
            // so emit an empty value that allows to dispatch
            // a remove JSON PATCH operation
            var emptyItem_1 = Object.create({});
            emptyItem_1[this.mandatoryField] = null;
            this.relationFields
                .forEach(function (field) {
                emptyItem_1[field] = null;
            });
            return [emptyItem_1];
        }
        return this._value;
    };
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicRelationGroupModel.prototype, "formConfiguration", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicRelationGroupModel.prototype, "mandatoryField", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicRelationGroupModel.prototype, "relationFields", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicRelationGroupModel.prototype, "scopeUUID", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicRelationGroupModel.prototype, "submissionScope", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicRelationGroupModel.prototype, "_value", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicRelationGroupModel.prototype, "type", void 0);
    return DynamicRelationGroupModel;
}(DsDynamicInputModel));
export { DynamicRelationGroupModel };
//# sourceMappingURL=dynamic-relation-group.model.js.map
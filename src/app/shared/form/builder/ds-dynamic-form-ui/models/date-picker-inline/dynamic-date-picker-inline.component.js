import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDatePickerModel, DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
var DsDatePickerInlineComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDatePickerInlineComponent, _super);
    function DsDatePickerInlineComponent(layoutService, validationService, config) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.config = config;
        _this.bindId = true;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerInlineComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDatePickerInlineComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerInlineComponent.prototype, "layout", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicDatePickerModel)
    ], DsDatePickerInlineComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDatePickerInlineComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDatePickerInlineComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDatePickerInlineComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        ViewChild(NgbDatepicker),
        tslib_1.__metadata("design:type", NgbDatepicker)
    ], DsDatePickerInlineComponent.prototype, "ngbDatePicker", void 0);
    DsDatePickerInlineComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-date-picker-inline',
            templateUrl: './dynamic-date-picker-inline.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [DynamicFormLayoutService,
            DynamicFormValidationService,
            NgbDatepickerConfig])
    ], DsDatePickerInlineComponent);
    return DsDatePickerInlineComponent;
}(DynamicFormControlComponent));
export { DsDatePickerInlineComponent };
//# sourceMappingURL=dynamic-date-picker-inline.component.js.map
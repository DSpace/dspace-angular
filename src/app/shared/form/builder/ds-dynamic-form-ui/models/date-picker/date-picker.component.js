import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDsDatePickerModel } from './date-picker.model';
import { hasValue } from '../../../../../empty.util';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
export var DS_DATE_PICKER_SEPARATOR = '-';
var DsDatePickerComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDatePickerComponent, _super);
    function DsDatePickerComponent(layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        // @Input()
        // minDate;
        // @Input()
        // maxDate;
        _this.selected = new EventEmitter();
        _this.remove = new EventEmitter();
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.minMonth = 1;
        _this.maxMonth = 12;
        _this.minDay = 1;
        _this.maxDay = 31;
        _this.yearPlaceholder = 'year';
        _this.monthPlaceholder = 'month';
        _this.dayPlaceholder = 'day';
        _this.disabledMonth = true;
        _this.disabledDay = true;
        return _this;
    }
    DsDatePickerComponent.prototype.ngOnInit = function () {
        var now = new Date();
        this.initialYear = now.getFullYear();
        this.initialMonth = now.getMonth() + 1;
        this.initialDay = now.getDate();
        if (this.model.value && this.model.value !== null) {
            var values = this.model.value.toString().split(DS_DATE_PICKER_SEPARATOR);
            if (values.length > 0) {
                this.initialYear = parseInt(values[0], 10);
                this.year = this.initialYear;
                this.disabledMonth = false;
            }
            if (values.length > 1) {
                this.initialMonth = parseInt(values[1], 10);
                this.month = this.initialMonth;
                this.disabledDay = false;
            }
            if (values.length > 2) {
                this.initialDay = parseInt(values[2], 10);
                this.day = this.initialDay;
            }
        }
        this.maxYear = this.initialYear + 100;
    };
    DsDatePickerComponent.prototype.onBlur = function (event) {
        this.blur.emit();
    };
    DsDatePickerComponent.prototype.onChange = function (event) {
        // update year-month-day
        switch (event.field) {
            case 'year': {
                if (event.value !== null) {
                    this.year = event.value;
                }
                else {
                    this.year = undefined;
                    this.month = undefined;
                    this.day = undefined;
                    this.disabledMonth = true;
                    this.disabledDay = true;
                }
                break;
            }
            case 'month': {
                if (event.value !== null) {
                    this.month = event.value;
                }
                else {
                    this.month = undefined;
                    this.day = undefined;
                    this.disabledDay = true;
                }
                break;
            }
            case 'day': {
                if (event.value !== null) {
                    this.day = event.value;
                }
                else {
                    this.day = undefined;
                }
                break;
            }
        }
        // set max for days by month/year
        if (!this.disabledDay) {
            var month = this.month ? this.month - 1 : 0;
            var date = new Date(this.year, month, 1);
            this.maxDay = this.getLastDay(date);
            if (this.day > this.maxDay) {
                this.day = this.maxDay;
            }
        }
        // Manage disable
        if (hasValue(this.year) && event.field === 'year') {
            this.disabledMonth = false;
        }
        else if (hasValue(this.month) && event.field === 'month') {
            this.disabledDay = false;
        }
        // update value
        var value = null;
        if (hasValue(this.year)) {
            var yyyy = this.year.toString();
            while (yyyy.length < 4) {
                yyyy = '0' + yyyy;
            }
            value = yyyy;
        }
        if (hasValue(this.month)) {
            var mm = this.month.toString().length === 1
                ? '0' + this.month.toString()
                : this.month.toString();
            value += DS_DATE_PICKER_SEPARATOR + mm;
        }
        if (hasValue(this.day)) {
            var dd = this.day.toString().length === 1
                ? '0' + this.day.toString()
                : this.day.toString();
            value += DS_DATE_PICKER_SEPARATOR + dd;
        }
        this.model.valueUpdates.next(value);
        this.change.emit(value);
    };
    DsDatePickerComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDatePickerComponent.prototype.getLastDay = function (date) {
        // Last Day of the same month (+1 month, -1 day)
        date.setMonth(date.getMonth() + 1, 0);
        return date.getDate();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDatePickerComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicDsDatePickerModel)
    ], DsDatePickerComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "selected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "remove", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DsDatePickerComponent.prototype, "focus", void 0);
    DsDatePickerComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-date-picker',
            styleUrls: ['./date-picker.component.scss'],
            templateUrl: './date-picker.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDatePickerComponent);
    return DsDatePickerComponent;
}(DynamicFormControlComponent));
export { DsDatePickerComponent };
//# sourceMappingURL=date-picker.component.js.map
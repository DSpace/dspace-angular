import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from '../empty.util';
var NumberPickerComponent = /** @class */ (function () {
    function NumberPickerComponent(fb, cd) {
        this.fb = fb;
        this.cd = cd;
        this.selected = new EventEmitter();
        this.remove = new EventEmitter();
        this.blur = new EventEmitter();
        this.change = new EventEmitter();
        this.focus = new EventEmitter();
    }
    NumberPickerComponent_1 = NumberPickerComponent;
    NumberPickerComponent.prototype.ngOnInit = function () {
        // this.startValue = this.value;
        this.step = this.step || 1;
        this.min = this.min || 0;
        this.max = this.max || 100;
        this.size = this.size || 1;
        this.disabled = this.disabled || false;
        this.invalid = this.invalid || false;
        this.cd.detectChanges();
    };
    NumberPickerComponent.prototype.ngOnChanges = function (changes) {
        if (this.value) {
            if (changes.max) {
                // When the user select a month with < # of days
                this.value = this.value > this.max ? this.max : this.value;
            }
        }
        else if (changes.value && changes.value.currentValue === null) {
            // When the user delete the inserted value
            this.value = null;
        }
        else if (changes.invalid) {
            this.invalid = changes.invalid.currentValue;
        }
    };
    NumberPickerComponent.prototype.changeValue = function (reverse) {
        if (reverse === void 0) { reverse = false; }
        // First after init
        if (isEmpty(this.value)) {
            this.value = this.startValue;
        }
        else {
            this.startValue = this.value;
            var newValue = this.value;
            if (reverse) {
                newValue -= this.step;
            }
            else {
                newValue += this.step;
            }
            if (newValue >= this.min && newValue <= this.max) {
                this.value = newValue;
            }
            else {
                if (newValue > this.max) {
                    this.value = this.min;
                }
                else {
                    this.value = this.max;
                }
            }
        }
        this.emitChange();
    };
    NumberPickerComponent.prototype.toggleDown = function () {
        this.changeValue(true);
    };
    NumberPickerComponent.prototype.toggleUp = function () {
        this.changeValue();
    };
    NumberPickerComponent.prototype.update = function (event) {
        try {
            var i = Number.parseInt(event.target.value, 10);
            if (i >= this.min && i <= this.max) {
                this.value = i;
                this.emitChange();
            }
            else if (event.target.value === null || event.target.value === '') {
                this.value = null;
                this.emitChange();
            }
            else {
                this.value = undefined;
            }
        }
        catch (e) {
            this.value = undefined;
        }
    };
    NumberPickerComponent.prototype.onBlur = function (event) {
        this.blur.emit(event);
    };
    NumberPickerComponent.prototype.onFocus = function (event) {
        if (this.value) {
            this.startValue = this.value;
        }
        this.focus.emit(event);
    };
    NumberPickerComponent.prototype.writeValue = function (value) {
        this.startValue = value || this.min;
    };
    NumberPickerComponent.prototype.registerOnChange = function (fn) {
        return;
    };
    NumberPickerComponent.prototype.registerOnTouched = function (fn) {
        return;
    };
    NumberPickerComponent.prototype.emitChange = function () {
        this.change.emit({ field: this.name, value: this.value });
    };
    var NumberPickerComponent_1;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], NumberPickerComponent.prototype, "step", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], NumberPickerComponent.prototype, "min", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], NumberPickerComponent.prototype, "max", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], NumberPickerComponent.prototype, "size", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NumberPickerComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NumberPickerComponent.prototype, "name", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NumberPickerComponent.prototype, "disabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NumberPickerComponent.prototype, "invalid", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], NumberPickerComponent.prototype, "value", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], NumberPickerComponent.prototype, "selected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], NumberPickerComponent.prototype, "remove", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], NumberPickerComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], NumberPickerComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], NumberPickerComponent.prototype, "focus", void 0);
    NumberPickerComponent = NumberPickerComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'ds-number-picker',
            styleUrls: ['./number-picker.component.scss'],
            templateUrl: './number-picker.component.html',
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: NumberPickerComponent_1, multi: true }
            ],
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder, ChangeDetectorRef])
    ], NumberPickerComponent);
    return NumberPickerComponent;
}());
export { NumberPickerComponent };
//# sourceMappingURL=number-picker.component.js.map
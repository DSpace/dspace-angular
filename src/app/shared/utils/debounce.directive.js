import * as tslib_1 from "tslib";
import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
var DebounceDirective = /** @class */ (function () {
    function DebounceDirective(model) {
        this.model = model;
        /**
         * Emits a value when nothing has changed in dsDebounce milliseconds
         */
        this.onDebounce = new EventEmitter();
        /**
         * The debounce time in milliseconds
         */
        this.dsDebounce = 500;
        /**
         * Subject to unsubscribe from
         */
        this.subject = new Subject();
    }
    /**
     * Start listening to changes of the input field's value changes
     * Emit it when the debounceTime is over without new changes
     */
    DebounceDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.model.valueChanges.pipe(takeUntil(this.subject), debounceTime(this.dsDebounce), distinctUntilChanged())
            .subscribe(function (modelValue) {
            if (_this.model.dirty) {
                _this.onDebounce.emit(modelValue);
            }
        });
    };
    /**
     * Close subject
     */
    DebounceDirective.prototype.ngOnDestroy = function () {
        this.subject.next();
        this.subject.complete();
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DebounceDirective.prototype, "onDebounce", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DebounceDirective.prototype, "dsDebounce", void 0);
    DebounceDirective = tslib_1.__decorate([
        Directive({
            selector: '[ngModel][dsDebounce]',
        })
        /**
         * Directive for setting a debounce time on an input field
         * It will emit the input field's value when no changes were made to this value in a given debounce time
         */
        ,
        tslib_1.__metadata("design:paramtypes", [NgControl])
    ], DebounceDirective);
    return DebounceDirective;
}());
export { DebounceDirective };
//# sourceMappingURL=debounce.directive.js.map
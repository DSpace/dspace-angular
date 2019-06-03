import * as tslib_1 from "tslib";
import { Directive, ElementRef, Input } from '@angular/core';
import { isNotEmpty } from '../empty.util';
/**
 * Directive to set focus on an element when it is rendered
 */
var AutoFocusDirective = /** @class */ (function () {
    function AutoFocusDirective(el) {
        this.el = el;
        /**
         * Optional input to specify which element in a component should get the focus
         * If left empty, the component itself will get the focus
         */
        this.autoFocusSelector = undefined;
    }
    AutoFocusDirective.prototype.ngAfterViewInit = function () {
        if (isNotEmpty(this.autoFocusSelector)) {
            return this.el.nativeElement.querySelector(this.autoFocusSelector).focus();
        }
        else {
            return this.el.nativeElement.focus();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AutoFocusDirective.prototype, "autoFocusSelector", void 0);
    AutoFocusDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsAutoFocus]'
        }),
        tslib_1.__metadata("design:paramtypes", [ElementRef])
    ], AutoFocusDirective);
    return AutoFocusDirective;
}());
export { AutoFocusDirective };
//# sourceMappingURL=auto-focus.directive.js.map
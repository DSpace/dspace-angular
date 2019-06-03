import * as tslib_1 from "tslib";
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
var ClickOutsideDirective = /** @class */ (function () {
    function ClickOutsideDirective(_elementRef) {
        this._elementRef = _elementRef;
        /**
         * Emits null when the user clicks outside of the element
         */
        this.dsClickOutside = new EventEmitter();
    }
    ClickOutsideDirective.prototype.onClick = function () {
        var hostElement = this._elementRef.nativeElement;
        var focusElement = hostElement.ownerDocument.activeElement;
        var clickedInside = hostElement.contains(focusElement);
        if (!clickedInside) {
            this.dsClickOutside.emit(null);
        }
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ClickOutsideDirective.prototype, "dsClickOutside", void 0);
    tslib_1.__decorate([
        HostListener('document:click'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], ClickOutsideDirective.prototype, "onClick", null);
    ClickOutsideDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsClickOutside]'
        })
        /**
         * Directive to detect when the users clicks outside of the element the directive was put on
         */
        ,
        tslib_1.__metadata("design:paramtypes", [ElementRef])
    ], ClickOutsideDirective);
    return ClickOutsideDirective;
}());
export { ClickOutsideDirective };
//# sourceMappingURL=click-outside.directive.js.map
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
var DragClickDirective = /** @class */ (function () {
    function DragClickDirective() {
        /**
         * Emits a click event when the click is perceived as an actual click and not a drag
         */
        this.actualClick = new EventEmitter();
    }
    /**
     * When the mouse button is pushed down, register the start time
     * @param event Mouse down event
     */
    DragClickDirective.prototype.mousedownEvent = function (event) {
        this.start = new Date();
    };
    /**
     * When the mouse button is let go of, check how long if it was down for
     * If the mouse button was down for more than 250ms, don't emit a click event
     * @param event Mouse down event
     */
    DragClickDirective.prototype.mouseupEvent = function (event) {
        var end = new Date();
        var clickTime = end - this.start;
        if (clickTime < 250) {
            this.actualClick.emit(event);
        }
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DragClickDirective.prototype, "actualClick", void 0);
    tslib_1.__decorate([
        HostListener('mousedown', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], DragClickDirective.prototype, "mousedownEvent", null);
    tslib_1.__decorate([
        HostListener('mouseup', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], DragClickDirective.prototype, "mouseupEvent", null);
    DragClickDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsDragClick]'
        })
        /**
         * Directive for preventing drag events being misinterpret as clicks
         * The difference is made using the time the mouse button is pushed down
         */
    ], DragClickDirective);
    return DragClickDirective;
}());
export { DragClickDirective };
//# sourceMappingURL=drag-click.directive.js.map
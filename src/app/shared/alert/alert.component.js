import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { trigger } from '@angular/animations';
import { AlertType } from './aletr-type';
import { fadeOutLeave, fadeOutState } from '../animations/fade';
/**
 * This component allow to create div that uses the Bootstrap's Alerts component.
 */
var AlertComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} cdr
     */
    function AlertComponent(cdr) {
        this.cdr = cdr;
        /**
         * A boolean representing if alert is dismissible
         */
        this.dismissible = false;
        /**
         * An event fired when alert is dismissed.
         */
        this.close = new EventEmitter();
        /**
         * The initial animation name
         */
        this.animate = 'fadeIn';
        /**
         * A boolean representing if alert is dismissed or not
         */
        this.dismissed = false;
    }
    /**
     * Dismiss div with animation
     */
    AlertComponent.prototype.dismiss = function () {
        var _this = this;
        if (this.dismissible) {
            this.animate = 'fadeOut';
            this.cdr.detectChanges();
            setTimeout(function () {
                _this.dismissed = true;
                _this.close.emit();
                _this.cdr.detectChanges();
            }, 300);
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AlertComponent.prototype, "content", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AlertComponent.prototype, "dismissible", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AlertComponent.prototype, "type", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AlertComponent.prototype, "close", void 0);
    AlertComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-alert',
            encapsulation: ViewEncapsulation.None,
            animations: [
                trigger('enterLeave', [
                    fadeOutLeave, fadeOutState,
                ])
            ],
            templateUrl: './alert.component.html',
            styleUrls: ['./alert.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef])
    ], AlertComponent);
    return AlertComponent;
}());
export { AlertComponent };
//# sourceMappingURL=alert.component.js.map
import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { TruncatableService } from './truncatable.service';
var TruncatableComponent = /** @class */ (function () {
    function TruncatableComponent(service) {
        this.service = service;
        /**
         * Is true when all truncatable parts in this truncatable should be expanded on loading
         */
        this.initialExpand = false;
        /**
         * Is true when the truncatable should expand on both hover as click
         */
        this.onHover = false;
    }
    /**
     * Set the initial state
     */
    TruncatableComponent.prototype.ngOnInit = function () {
        if (this.initialExpand) {
            this.service.expand(this.id);
        }
        else {
            this.service.collapse(this.id);
        }
    };
    /**
     * If onHover is true, collapses the truncatable
     */
    TruncatableComponent.prototype.hoverCollapse = function () {
        if (this.onHover) {
            this.service.collapse(this.id);
        }
    };
    /**
     * If onHover is true, expands the truncatable
     */
    TruncatableComponent.prototype.hoverExpand = function () {
        if (this.onHover) {
            this.service.expand(this.id);
        }
    };
    /**
     * Expands the truncatable when it's collapsed, collapses it when it's expanded
     */
    TruncatableComponent.prototype.toggle = function () {
        this.service.toggle(this.id);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TruncatableComponent.prototype, "initialExpand", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TruncatableComponent.prototype, "id", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TruncatableComponent.prototype, "onHover", void 0);
    TruncatableComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-truncatable',
            templateUrl: './truncatable.component.html',
            styleUrls: ['./truncatable.component.scss'],
        })
        /**
         * Component that represents a section with one or more truncatable parts that all listen to this state
         */
        ,
        tslib_1.__metadata("design:paramtypes", [TruncatableService])
    ], TruncatableComponent);
    return TruncatableComponent;
}());
export { TruncatableComponent };
//# sourceMappingURL=truncatable.component.js.map
import * as tslib_1 from "tslib";
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
/* tslint:disable:directive-selector */
var VarDirective = /** @class */ (function () {
    function VarDirective(vcRef, templateRef) {
        this.vcRef = vcRef;
        this.templateRef = templateRef;
        this.context = {};
    }
    Object.defineProperty(VarDirective.prototype, "ngVar", {
        set: function (context) {
            this.context.$implicit = this.context.ngVar = context;
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    VarDirective.prototype.updateView = function () {
        this.vcRef.clear();
        this.vcRef.createEmbeddedView(this.templateRef, this.context);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], VarDirective.prototype, "ngVar", null);
    VarDirective = tslib_1.__decorate([
        Directive({
            selector: '[ngVar]',
        }),
        tslib_1.__metadata("design:paramtypes", [ViewContainerRef, TemplateRef])
    ], VarDirective);
    return VarDirective;
}());
export { VarDirective };
/* tslint:enable:directive-selector */
//# sourceMappingURL=var.directive.js.map
import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
var AbstractListableElementComponent = /** @class */ (function () {
    function AbstractListableElementComponent(listableObject) {
        this.listableObject = listableObject;
        this.object = listableObject;
    }
    AbstractListableElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-abstract-object-element',
            template: "",
        }),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], AbstractListableElementComponent);
    return AbstractListableElementComponent;
}());
export { AbstractListableElementComponent };
//# sourceMappingURL=abstract-listable-element.component.js.map
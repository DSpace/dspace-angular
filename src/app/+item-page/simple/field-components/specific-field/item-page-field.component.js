import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
/**
 * This component can be used to represent metadata on a simple item page.
 * It expects one input parameter of type Item to which the metadata belongs.
 * This class can be extended to print certain metadata.
 */
var ItemPageFieldComponent = /** @class */ (function () {
    function ItemPageFieldComponent() {
        /**
         * Separator string between multiple values of the metadata fields defined
         * @type {string}
         */
        this.separator = '<br/>';
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageFieldComponent.prototype, "item", void 0);
    ItemPageFieldComponent = tslib_1.__decorate([
        Component({
            templateUrl: './item-page-field.component.html'
        })
    ], ItemPageFieldComponent);
    return ItemPageFieldComponent;
}());
export { ItemPageFieldComponent };
//# sourceMappingURL=item-page-field.component.js.map
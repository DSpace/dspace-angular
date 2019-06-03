import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ItemViewMode } from '../../../shared/items/item-type-decorator';
var RelatedItemsComponent = /** @class */ (function () {
    function RelatedItemsComponent() {
        /**
         * The view-mode we're currently on
         * @type {ElementViewMode}
         */
        this.viewMode = ItemViewMode.Element;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], RelatedItemsComponent.prototype, "items", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], RelatedItemsComponent.prototype, "label", void 0);
    RelatedItemsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-related-items',
            styleUrls: ['./related-items.component.scss'],
            templateUrl: './related-items.component.html'
        })
        /**
         * This component is used for displaying relations between items
         * It expects a list of items to display and a label to put on top
         */
    ], RelatedItemsComponent);
    return RelatedItemsComponent;
}());
export { RelatedItemsComponent };
//# sourceMappingURL=related-items-component.js.map
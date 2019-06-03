import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ItemOperation } from './itemOperation.model';
var ItemOperationComponent = /** @class */ (function () {
    /**
     * Operation that can be performed on an item
     */
    function ItemOperationComponent() {
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", ItemOperation)
    ], ItemOperationComponent.prototype, "operation", void 0);
    ItemOperationComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-operation',
            templateUrl: './item-operation.component.html'
        })
        /**
         * Operation that can be performed on an item
         */
    ], ItemOperationComponent);
    return ItemOperationComponent;
}());
export { ItemOperationComponent };
//# sourceMappingURL=item-operation.component.js.map
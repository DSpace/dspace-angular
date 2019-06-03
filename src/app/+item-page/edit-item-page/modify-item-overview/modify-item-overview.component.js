import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
var ModifyItemOverviewComponent = /** @class */ (function () {
    /**
     * Component responsible for rendering a table containing the metadatavalues from the to be edited item
     */
    function ModifyItemOverviewComponent() {
    }
    ModifyItemOverviewComponent.prototype.ngOnInit = function () {
        this.metadata = this.item.metadata;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ModifyItemOverviewComponent.prototype, "item", void 0);
    ModifyItemOverviewComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-modify-item-overview',
            templateUrl: './modify-item-overview.component.html'
        })
        /**
         * Component responsible for rendering a table containing the metadatavalues from the to be edited item
         */
    ], ModifyItemOverviewComponent);
    return ModifyItemOverviewComponent;
}());
export { ModifyItemOverviewComponent };
//# sourceMappingURL=modify-item-overview.component.js.map
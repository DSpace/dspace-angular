import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { fadeInOut } from '../../../animations/fade';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { MyDSpaceResult } from '../../../../+my-dspace-page/my-dspace-result.model';
/**
 * This component show metadata for the given item object in the list view.
 */
var ItemListPreviewComponent = /** @class */ (function () {
    function ItemListPreviewComponent() {
        /**
         * A boolean representing if to show submitter information
         */
        this.showSubmitter = false;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemListPreviewComponent.prototype, "item", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", MyDSpaceResult)
    ], ItemListPreviewComponent.prototype, "object", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemListPreviewComponent.prototype, "status", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemListPreviewComponent.prototype, "showSubmitter", void 0);
    ItemListPreviewComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-list-preview',
            styleUrls: ['item-list-preview.component.scss'],
            templateUrl: 'item-list-preview.component.html',
            animations: [fadeInOut]
        })
    ], ItemListPreviewComponent);
    return ItemListPreviewComponent;
}());
export { ItemListPreviewComponent };
//# sourceMappingURL=item-list-preview.component.js.map
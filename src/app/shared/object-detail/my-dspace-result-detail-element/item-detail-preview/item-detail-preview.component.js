import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { fadeInOut } from '../../../animations/fade';
import { MyDSpaceResult } from '../../../../+my-dspace-page/my-dspace-result.model';
/**
 * This component show metadata for the given item object in the detail view.
 */
var ItemDetailPreviewComponent = /** @class */ (function () {
    function ItemDetailPreviewComponent() {
        /**
         * A boolean representing if to show submitter information
         */
        this.showSubmitter = false;
        /**
         * The value's separator
         */
        this.separator = ', ';
    }
    /**
     * Initialize all instance variables
     */
    ItemDetailPreviewComponent.prototype.ngOnInit = function () {
        this.thumbnail$ = this.item.getThumbnail();
        this.bitstreams$ = this.item.getFiles();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemDetailPreviewComponent.prototype, "item", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", MyDSpaceResult)
    ], ItemDetailPreviewComponent.prototype, "object", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemDetailPreviewComponent.prototype, "status", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemDetailPreviewComponent.prototype, "showSubmitter", void 0);
    ItemDetailPreviewComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-detail-preview',
            styleUrls: ['./item-detail-preview.component.scss'],
            templateUrl: './item-detail-preview.component.html',
            animations: [fadeInOut]
        })
    ], ItemDetailPreviewComponent);
    return ItemDetailPreviewComponent;
}());
export { ItemDetailPreviewComponent };
//# sourceMappingURL=item-detail-preview.component.js.map
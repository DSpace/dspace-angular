import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Metadata } from '../../../../../core/shared/metadata.utils';
import { MyDSpaceResult } from '../../../../../+my-dspace-page/my-dspace-result.model';
import { Item } from '../../../../../core/shared/item.model';
/**
 * This component show values for the given item metadata
 */
var ItemDetailPreviewFieldComponent = /** @class */ (function () {
    function ItemDetailPreviewFieldComponent() {
    }
    /**
     * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string[]} the matching string values or an empty array.
     */
    ItemDetailPreviewFieldComponent.prototype.allMetadataValues = function (keyOrKeys) {
        return Metadata.allValues([this.object.hitHighlights, this.item.metadata], keyOrKeys);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemDetailPreviewFieldComponent.prototype, "item", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", MyDSpaceResult)
    ], ItemDetailPreviewFieldComponent.prototype, "object", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemDetailPreviewFieldComponent.prototype, "label", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemDetailPreviewFieldComponent.prototype, "metadata", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemDetailPreviewFieldComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemDetailPreviewFieldComponent.prototype, "separator", void 0);
    ItemDetailPreviewFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-detail-preview-field',
            templateUrl: './item-detail-preview-field.component.html'
        })
    ], ItemDetailPreviewFieldComponent);
    return ItemDetailPreviewFieldComponent;
}());
export { ItemDetailPreviewFieldComponent };
//# sourceMappingURL=item-detail-preview-field.component.js.map
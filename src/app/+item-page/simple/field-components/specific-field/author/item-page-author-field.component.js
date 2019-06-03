import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var ItemPageAuthorFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPageAuthorFieldComponent, _super);
    function ItemPageAuthorFieldComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields (schema.element.qualifier) used to render their values.
         * In this component, we want to display values for metadata 'dc.contributor.author', 'dc.creator' and 'dc.contributor'
         */
        _this.fields = [
            'dc.contributor.author',
            'dc.creator',
            'dc.contributor'
        ];
        /**
         * Label i18n key for the rendered metadata
         */
        _this.label = 'item.page.author';
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageAuthorFieldComponent.prototype, "item", void 0);
    ItemPageAuthorFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-author-field',
            templateUrl: '../item-page-field.component.html'
        })
        /**
         * This component is used for displaying the author (dc.contributor.author, dc.creator and dc.contributor) metadata of an item
         */
    ], ItemPageAuthorFieldComponent);
    return ItemPageAuthorFieldComponent;
}(ItemPageFieldComponent));
export { ItemPageAuthorFieldComponent };
//# sourceMappingURL=item-page-author-field.component.js.map
import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var ItemPageUriFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPageUriFieldComponent, _super);
    function ItemPageUriFieldComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields (schema.element.qualifier) used to render their values.
         * In this component, we want to display values for metadata 'dc.identifier.uri'
         */
        _this.fields = [
            'dc.identifier.uri'
        ];
        /**
         * Label i18n key for the rendered metadata
         */
        _this.label = 'item.page.uri';
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageUriFieldComponent.prototype, "item", void 0);
    ItemPageUriFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-uri-field',
            templateUrl: './item-page-uri-field.component.html'
        })
        /**
         * This component is used for displaying the uri (dc.identifier.uri) metadata of an item
         */
    ], ItemPageUriFieldComponent);
    return ItemPageUriFieldComponent;
}(ItemPageFieldComponent));
export { ItemPageUriFieldComponent };
//# sourceMappingURL=item-page-uri-field.component.js.map
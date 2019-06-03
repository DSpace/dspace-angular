import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var ItemPageDateFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPageDateFieldComponent, _super);
    function ItemPageDateFieldComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Separator string between multiple values of the metadata fields defined
         * @type {string}
         */
        _this.separator = ', ';
        /**
         * Fields (schema.element.qualifier) used to render their values.
         * In this component, we want to display values for metadata 'dc.date.issued'
         */
        _this.fields = [
            'dc.date.issued'
        ];
        /**
         * Label i18n key for the rendered metadata
         */
        _this.label = 'item.page.date';
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageDateFieldComponent.prototype, "item", void 0);
    ItemPageDateFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-date-field',
            templateUrl: '../item-page-field.component.html'
        })
        /**
         * This component is used for displaying the issue date (dc.date.issued) metadata of an item
         */
    ], ItemPageDateFieldComponent);
    return ItemPageDateFieldComponent;
}(ItemPageFieldComponent));
export { ItemPageDateFieldComponent };
//# sourceMappingURL=item-page-date-field.component.js.map
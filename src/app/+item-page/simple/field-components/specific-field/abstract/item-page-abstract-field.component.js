import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var ItemPageAbstractFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPageAbstractFieldComponent, _super);
    function ItemPageAbstractFieldComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields (schema.element.qualifier) used to render their values.
         * In this component, we want to display values for metadata 'dc.description.abstract'
         */
        _this.fields = [
            'dc.description.abstract'
        ];
        /**
         * Label i18n key for the rendered metadata
         */
        _this.label = 'item.page.abstract';
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageAbstractFieldComponent.prototype, "item", void 0);
    ItemPageAbstractFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-abstract-field',
            templateUrl: '../item-page-field.component.html'
        })
        /**
         * This component is used for displaying the abstract (dc.description.abstract) of an item
         */
    ], ItemPageAbstractFieldComponent);
    return ItemPageAbstractFieldComponent;
}(ItemPageFieldComponent));
export { ItemPageAbstractFieldComponent };
//# sourceMappingURL=item-page-abstract-field.component.js.map
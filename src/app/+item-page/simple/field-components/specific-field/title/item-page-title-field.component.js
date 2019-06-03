import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var ItemPageTitleFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPageTitleFieldComponent, _super);
    function ItemPageTitleFieldComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields (schema.element.qualifier) used to render their values.
         * In this component, we want to display values for metadata 'dc.title'
         */
        _this.fields = [
            'dc.title'
        ];
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemPageTitleFieldComponent.prototype, "item", void 0);
    ItemPageTitleFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-title-field',
            templateUrl: './item-page-title-field.component.html'
        })
        /**
         * This component is used for displaying the title (dc.title) of an item
         */
    ], ItemPageTitleFieldComponent);
    return ItemPageTitleFieldComponent;
}(ItemPageFieldComponent));
export { ItemPageTitleFieldComponent };
//# sourceMappingURL=item-page-title-field.component.js.map
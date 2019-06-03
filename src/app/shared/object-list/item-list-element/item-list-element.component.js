import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { SetViewMode } from '../../view-mode';
import { ItemViewMode } from '../../items/item-type-decorator';
var ItemListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemListElementComponent, _super);
    function ItemListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.viewMode = ItemViewMode.Element;
        return _this;
    }
    ItemListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-list-element',
            styleUrls: ['./item-list-element.component.scss'],
            templateUrl: './item-list-element.component.html'
        })
        /**
         * The component used to list items depending on type
         * Uses item-type-switcher to determine which components to use for displaying the list
         */
        ,
        renderElementsFor(Item, SetViewMode.List)
    ], ItemListElementComponent);
    return ItemListElementComponent;
}(AbstractListableElementComponent));
export { ItemListElementComponent };
//# sourceMappingURL=item-list-element.component.js.map
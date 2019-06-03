import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { SetViewMode } from '../../view-mode';
var ItemGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemGridElementComponent, _super);
    function ItemGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-grid-element',
            styleUrls: ['./item-grid-element.component.scss'],
            templateUrl: './item-grid-element.component.html'
        }),
        renderElementsFor(Item, SetViewMode.Grid)
    ], ItemGridElementComponent);
    return ItemGridElementComponent;
}(AbstractListableElementComponent));
export { ItemGridElementComponent };
//# sourceMappingURL=item-grid-element.component.js.map
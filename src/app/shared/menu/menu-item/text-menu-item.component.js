import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { TextMenuItemModel } from './models/text.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
/**
 * Component that renders a menu section of type TEXT
 */
var TextMenuItemComponent = /** @class */ (function () {
    function TextMenuItemComponent(item) {
        this.item = item;
    }
    TextMenuItemComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-text-menu-item',
            templateUrl: './text-menu-item.component.html',
        }),
        rendersMenuItemForType(MenuItemType.TEXT),
        tslib_1.__param(0, Inject('itemModelProvider')),
        tslib_1.__metadata("design:paramtypes", [TextMenuItemModel])
    ], TextMenuItemComponent);
    return TextMenuItemComponent;
}());
export { TextMenuItemComponent };
//# sourceMappingURL=text-menu-item.component.js.map
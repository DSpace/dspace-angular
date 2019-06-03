import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { OnClickMenuItemModel } from './models/onclick.model';
/**
 * Component that renders a menu section of type ONCLICK
 */
var OnClickMenuItemComponent = /** @class */ (function () {
    function OnClickMenuItemComponent(item) {
        this.item = item;
    }
    OnClickMenuItemComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-onclick-menu-item',
            styleUrls: ['./onclick-menu-item.component.scss'],
            templateUrl: './onclick-menu-item.component.html'
        }),
        rendersMenuItemForType(MenuItemType.ONCLICK),
        tslib_1.__param(0, Inject('itemModelProvider')),
        tslib_1.__metadata("design:paramtypes", [OnClickMenuItemModel])
    ], OnClickMenuItemComponent);
    return OnClickMenuItemComponent;
}());
export { OnClickMenuItemComponent };
//# sourceMappingURL=onclick-menu-item.component.js.map
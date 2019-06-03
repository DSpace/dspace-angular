import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { GLOBAL_CONFIG } from '../../../../config';
import { isNotEmpty } from '../../empty.util';
/**
 * Component that renders a menu section of type LINK
 */
var LinkMenuItemComponent = /** @class */ (function () {
    function LinkMenuItemComponent(item, EnvConfig) {
        this.EnvConfig = EnvConfig;
        this.item = item;
    }
    LinkMenuItemComponent.prototype.ngOnInit = function () {
        this.hasLink = isNotEmpty(this.item.link);
    };
    LinkMenuItemComponent.prototype.getRouterLink = function () {
        if (this.hasLink) {
            return this.EnvConfig.ui.nameSpace + this.item.link;
        }
        return undefined;
    };
    LinkMenuItemComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-link-menu-item',
            templateUrl: './link-menu-item.component.html'
        }),
        rendersMenuItemForType(MenuItemType.LINK),
        tslib_1.__param(0, Inject('itemModelProvider')), tslib_1.__param(1, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [LinkMenuItemModel, Object])
    ], LinkMenuItemComponent);
    return LinkMenuItemComponent;
}());
export { LinkMenuItemComponent };
//# sourceMappingURL=link-menu-item.component.js.map
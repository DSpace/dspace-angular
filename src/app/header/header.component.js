import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';
/**
 * Represents the header with the logo and simple navigation
 */
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(menuService) {
        this.menuService = menuService;
        this.showAuth = false;
        this.menuID = MenuID.PUBLIC;
    }
    HeaderComponent.prototype.toggleNavbar = function () {
        this.menuService.toggleMenu(this.menuID);
    };
    HeaderComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-header',
            styleUrls: ['header.component.scss'],
            templateUrl: 'header.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [MenuService])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map
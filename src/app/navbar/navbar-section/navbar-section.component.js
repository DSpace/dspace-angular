import * as tslib_1 from "tslib";
import { Component, Inject, Injector } from '@angular/core';
import { MenuSectionComponent } from '../../shared/menu/menu-section/menu-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
/**
 * Represents a non-expandable section in the navbar
 */
var NavbarSectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(NavbarSectionComponent, _super);
    function NavbarSectionComponent(menuSection, menuService, injector) {
        var _this = _super.call(this, menuSection, menuService, injector) || this;
        _this.menuService = menuService;
        _this.injector = injector;
        /**
         * This section resides in the Public Navbar
         */
        _this.menuID = MenuID.PUBLIC;
        return _this;
    }
    NavbarSectionComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    NavbarSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-navbar-section',
            templateUrl: './navbar-section.component.html',
            styleUrls: ['./navbar-section.component.scss']
        }),
        rendersSectionForMenu(MenuID.PUBLIC, false),
        tslib_1.__param(0, Inject('sectionDataProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, MenuService,
            Injector])
    ], NavbarSectionComponent);
    return NavbarSectionComponent;
}(MenuSectionComponent));
export { NavbarSectionComponent };
//# sourceMappingURL=navbar-section.component.js.map
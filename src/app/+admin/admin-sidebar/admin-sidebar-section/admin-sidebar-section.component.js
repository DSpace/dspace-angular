import * as tslib_1 from "tslib";
import { Component, Inject, Injector } from '@angular/core';
import { MenuSectionComponent } from '../../../shared/menu/menu-section/menu-section.component';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { MenuService } from '../../../shared/menu/menu.service';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';
import { MenuSection } from '../../../shared/menu/menu.reducer';
/**
 * Represents a non-expandable section in the admin sidebar
 */
var AdminSidebarSectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AdminSidebarSectionComponent, _super);
    function AdminSidebarSectionComponent(menuSection, menuService, injector) {
        var _this = _super.call(this, menuSection, menuService, injector) || this;
        _this.menuService = menuService;
        _this.injector = injector;
        /**
         * This section resides in the Admin Sidebar
         */
        _this.menuID = MenuID.ADMIN;
        _this.itemModel = menuSection.model;
        return _this;
    }
    AdminSidebarSectionComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    AdminSidebarSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-admin-sidebar-section',
            templateUrl: './admin-sidebar-section.component.html',
            styleUrls: ['./admin-sidebar-section.component.scss'],
        }),
        rendersSectionForMenu(MenuID.ADMIN, false),
        tslib_1.__param(0, Inject('sectionDataProvider')),
        tslib_1.__metadata("design:paramtypes", [MenuSection, MenuService, Injector])
    ], AdminSidebarSectionComponent);
    return AdminSidebarSectionComponent;
}(MenuSectionComponent));
export { AdminSidebarSectionComponent };
//# sourceMappingURL=admin-sidebar-section.component.js.map
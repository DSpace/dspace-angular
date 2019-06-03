import * as tslib_1 from "tslib";
import { Component, Inject, Injector } from '@angular/core';
import { rotate } from '../../../shared/animations/rotate';
import { AdminSidebarSectionComponent } from '../admin-sidebar-section/admin-sidebar-section.component';
import { slide } from '../../../shared/animations/slide';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { bgColor } from '../../../shared/animations/bgColor';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { MenuService } from '../../../shared/menu/menu.service';
import { combineLatest as combineLatestObservable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';
/**
 * Represents a expandable section in the sidebar
 */
var ExpandableAdminSidebarSectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ExpandableAdminSidebarSectionComponent, _super);
    function ExpandableAdminSidebarSectionComponent(menuSection, menuService, variableService, injector) {
        var _this = _super.call(this, menuSection, menuService, injector) || this;
        _this.menuService = menuService;
        _this.variableService = variableService;
        _this.injector = injector;
        /**
         * This section resides in the Admin Sidebar
         */
        _this.menuID = MenuID.ADMIN;
        return _this;
    }
    /**
     * Set initial values for instance variables
     */
    ExpandableAdminSidebarSectionComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.sidebarActiveBg = this.variableService.getVariable('adminSidebarActiveBg');
        this.sidebarCollapsed = this.menuService.isMenuCollapsed(this.menuID);
        this.sidebarPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
        this.expanded = combineLatestObservable(this.active, this.sidebarCollapsed, this.sidebarPreviewCollapsed)
            .pipe(map(function (_a) {
            var active = _a[0], sidebarCollapsed = _a[1], sidebarPreviewCollapsed = _a[2];
            return (active && (!sidebarCollapsed || !sidebarPreviewCollapsed));
        }));
    };
    ExpandableAdminSidebarSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-expandable-admin-sidebar-section',
            templateUrl: './expandable-admin-sidebar-section.component.html',
            styleUrls: ['./expandable-admin-sidebar-section.component.scss'],
            animations: [rotate, slide, bgColor]
        }),
        rendersSectionForMenu(MenuID.ADMIN, true),
        tslib_1.__param(0, Inject('sectionDataProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, MenuService,
            CSSVariableService, Injector])
    ], ExpandableAdminSidebarSectionComponent);
    return ExpandableAdminSidebarSectionComponent;
}(AdminSidebarSectionComponent));
export { ExpandableAdminSidebarSectionComponent };
//# sourceMappingURL=expandable-admin-sidebar-section.component.js.map
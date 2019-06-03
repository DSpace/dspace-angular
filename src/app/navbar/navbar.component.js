import * as tslib_1 from "tslib";
import { Component, Injector } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { HostWindowService } from '../shared/host-window.service';
/**
 * Component representing the public navbar
 */
var NavbarComponent = /** @class */ (function (_super) {
    tslib_1.__extends(NavbarComponent, _super);
    function NavbarComponent(menuService, injector, windowService) {
        var _this = _super.call(this, menuService, injector) || this;
        _this.menuService = menuService;
        _this.injector = injector;
        _this.windowService = windowService;
        /**
         * The menu ID of the Navbar is PUBLIC
         * @type {MenuID.PUBLIC}
         */
        _this.menuID = MenuID.PUBLIC;
        return _this;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        this.createMenu();
        _super.prototype.ngOnInit.call(this);
    };
    /**
     * Initialize all menu sections and items for this menu
     */
    NavbarComponent.prototype.createMenu = function () {
        var _this = this;
        var menuList = [
            /* News */
            {
                id: 'browse_global',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.browse_global'
                },
                index: 0
            },
            // {
            //   id: 'browse_global_communities_and_collections',
            //   parentID: 'browse_global',
            //   active: false,
            //   visible: true,
            //   model: {
            //     type: MenuItemType.LINK,
            //     text: 'menu.section.browse_global_communities_and_collections',
            //     link: '#'
            //   } as LinkMenuItemModel,
            // },
            {
                id: 'browse_global_global_by_title',
                parentID: 'browse_global',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.browse_global_by_title',
                    link: '/browse/title'
                },
            },
            {
                id: 'browse_global_global_by_issue_date',
                parentID: 'browse_global',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.browse_global_by_issue_date',
                    link: '/browse/dateissued'
                },
            },
            {
                id: 'browse_global_by_author',
                parentID: 'browse_global',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.browse_global_by_author',
                    link: '/browse/author'
                },
            },
            {
                id: 'browse_global_by_subject',
                parentID: 'browse_global',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.browse_global_by_subject',
                    link: '/browse/subject'
                },
            },
            /* Statistics */
            {
                id: 'statistics',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.statistics',
                    link: ''
                },
                index: 2
            },
        ];
        menuList.forEach(function (menuSection) { return _this.menuService.addSection(_this.menuID, menuSection); });
    };
    NavbarComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-navbar',
            styleUrls: ['navbar.component.scss'],
            templateUrl: 'navbar.component.html',
            animations: [slideMobileNav]
        }),
        tslib_1.__metadata("design:paramtypes", [MenuService,
            Injector,
            HostWindowService])
    ], NavbarComponent);
    return NavbarComponent;
}(MenuComponent));
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map
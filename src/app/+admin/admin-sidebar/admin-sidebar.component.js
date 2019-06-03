import * as tslib_1 from "tslib";
import { Component, Injector } from '@angular/core';
import { slideHorizontal, slideSidebar } from '../../shared/animations/slide';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../../shared/menu/initial-menus-state';
import { MenuComponent } from '../../shared/menu/menu.component';
import { AuthService } from '../../core/auth/auth.service';
import { first, map } from 'rxjs/operators';
import { combineLatest as combineLatestObservable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCommunityParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';
import { CreateCollectionParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';
import { EditItemSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';
import { EditCommunitySelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import { EditCollectionSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';
/**
 * Component representing the admin sidebar
 */
var AdminSidebarComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AdminSidebarComponent, _super);
    function AdminSidebarComponent(menuService, injector, variableService, authService, modalService) {
        var _this = _super.call(this, menuService, injector) || this;
        _this.menuService = menuService;
        _this.injector = injector;
        _this.variableService = variableService;
        _this.authService = authService;
        _this.modalService = modalService;
        /**
         * The menu ID of the Navbar is PUBLIC
         * @type {MenuID.ADMIN}
         */
        _this.menuID = MenuID.ADMIN;
        /**
         * Is true when the sidebar is open, is false when the sidebar is animating or closed
         * @type {boolean}
         */
        _this.sidebarOpen = true; // Open in UI, animation finished
        /**
         * Is true when the sidebar is closed, is false when the sidebar is animating or open
         * @type {boolean}
         */
        _this.sidebarClosed = !_this.sidebarOpen; // Closed in UI, animation finished
        return _this;
    }
    /**
     * Set and calculate all initial values of the instance variables
     */
    AdminSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createMenu();
        _super.prototype.ngOnInit.call(this);
        this.sidebarWidth = this.variableService.getVariable('sidebarItemsWidth');
        this.authService.isAuthenticated()
            .subscribe(function (loggedIn) {
            if (loggedIn) {
                _this.menuService.showMenu(_this.menuID);
            }
        });
        this.menuCollapsed.pipe(first())
            .subscribe(function (collapsed) {
            _this.sidebarOpen = !collapsed;
            _this.sidebarClosed = collapsed;
        });
        this.sidebarExpanded = combineLatestObservable(this.menuCollapsed, this.menuPreviewCollapsed)
            .pipe(map(function (_a) {
            var collapsed = _a[0], previewCollapsed = _a[1];
            return (!collapsed || !previewCollapsed);
        }));
    };
    /**
     * Initialize all menu sections and items for this menu
     */
    AdminSidebarComponent.prototype.createMenu = function () {
        var _this = this;
        var menuList = [
            /* News */
            {
                id: 'new',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.new'
                },
                icon: 'plus-circle',
                index: 0
            },
            {
                id: 'new_community',
                parentID: 'new',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.ONCLICK,
                    text: 'menu.section.new_community',
                    function: function () {
                        _this.modalService.open(CreateCommunityParentSelectorComponent);
                    }
                },
            },
            {
                id: 'new_collection',
                parentID: 'new',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.ONCLICK,
                    text: 'menu.section.new_collection',
                    function: function () {
                        _this.modalService.open(CreateCollectionParentSelectorComponent);
                    }
                },
            },
            {
                id: 'new_item',
                parentID: 'new',
                active: false,
                visible: true,
                // model: {
                //   type: MenuItemType.ONCLICK,
                //   text: 'menu.section.new_item',
                //   function: () => {
                //     this.modalService.open(CreateItemParentSelectorComponent);
                //   }
                // } as OnClickMenuItemModel,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.new_item',
                    link: '/submit'
                },
            },
            {
                id: 'new_item_version',
                parentID: 'new',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.new_item_version',
                    link: ''
                },
            },
            /* Edit */
            {
                id: 'edit',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.edit'
                },
                icon: 'pencil-alt',
                index: 1
            },
            {
                id: 'edit_community',
                parentID: 'edit',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.ONCLICK,
                    text: 'menu.section.edit_community',
                    function: function () {
                        _this.modalService.open(EditCommunitySelectorComponent);
                    }
                },
            },
            {
                id: 'edit_collection',
                parentID: 'edit',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.ONCLICK,
                    text: 'menu.section.edit_collection',
                    function: function () {
                        _this.modalService.open(EditCollectionSelectorComponent);
                    }
                },
            },
            {
                id: 'edit_item',
                parentID: 'edit',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.ONCLICK,
                    text: 'menu.section.edit_item',
                    function: function () {
                        _this.modalService.open(EditItemSelectorComponent);
                    }
                },
            },
            /* Import */
            {
                id: 'import',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.import'
                },
                icon: 'sign-in-alt',
                index: 2
            },
            {
                id: 'import_metadata',
                parentID: 'import',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.import_metadata',
                    link: ''
                },
            },
            {
                id: 'import_batch',
                parentID: 'import',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.import_batch',
                    link: ''
                },
            },
            /* Export */
            {
                id: 'export',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.export'
                },
                icon: 'sign-out-alt',
                index: 3
            },
            {
                id: 'export_community',
                parentID: 'export',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.export_community',
                    link: ''
                },
            },
            {
                id: 'export_collection',
                parentID: 'export',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.export_collection',
                    link: ''
                },
            },
            {
                id: 'export_item',
                parentID: 'export',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.export_item',
                    link: ''
                },
            }, {
                id: 'export_metadata',
                parentID: 'export',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.export_metadata',
                    link: ''
                },
            },
            /* Access Control */
            {
                id: 'access_control',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.access_control'
                },
                icon: 'key',
                index: 4
            },
            {
                id: 'access_control_people',
                parentID: 'access_control',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.access_control_people',
                    link: ''
                },
            },
            {
                id: 'access_control_groups',
                parentID: 'access_control',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.access_control_groups',
                    link: ''
                },
            },
            {
                id: 'access_control_authorizations',
                parentID: 'access_control',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.access_control_authorizations',
                    link: ''
                },
            },
            /*  Search */
            {
                id: 'find',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.find'
                },
                icon: 'search',
                index: 5
            },
            {
                id: 'find_items',
                parentID: 'find',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.find_items',
                    link: '/search'
                },
            },
            {
                id: 'find_withdrawn_items',
                parentID: 'find',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.find_withdrawn_items',
                    link: ''
                },
            },
            {
                id: 'find_private_items',
                parentID: 'find',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.find_private_items',
                    link: ''
                },
            },
            /*  Registries */
            {
                id: 'registries',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.TEXT,
                    text: 'menu.section.registries'
                },
                icon: 'list',
                index: 6
            },
            {
                id: 'registries_metadata',
                parentID: 'registries',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.registries_metadata',
                    link: 'admin/registries/metadata'
                },
            },
            {
                id: 'registries_format',
                parentID: 'registries',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.registries_format',
                    link: 'admin/registries/bitstream-formats'
                },
            },
            /* Curation tasks */
            {
                id: 'curation_tasks',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.curation_task',
                    link: ''
                },
                icon: 'filter',
                index: 7
            },
            /* Statistics */
            {
                id: 'statistics_task',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.statistics_task',
                    link: ''
                },
                icon: 'chart-bar',
                index: 8
            },
            /* Control Panel */
            {
                id: 'control_panel',
                active: false,
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.control_panel',
                    link: ''
                },
                icon: 'cogs',
                index: 9
            },
        ];
        menuList.forEach(function (menuSection) { return _this.menuService.addSection(_this.menuID, menuSection); });
    };
    /**
     * Method to change this.collapsed to false when the slide animation ends and is sliding open
     * @param event The animation event
     */
    AdminSidebarComponent.prototype.startSlide = function (event) {
        if (event.toState === 'expanded') {
            this.sidebarClosed = false;
        }
        else if (event.toState === 'collapsed') {
            this.sidebarOpen = false;
        }
    };
    /**
     * Method to change this.collapsed to false when the slide animation ends and is sliding open
     * @param event The animation event
     */
    AdminSidebarComponent.prototype.finishSlide = function (event) {
        if (event.fromState === 'expanded') {
            this.sidebarClosed = true;
        }
        else if (event.fromState === 'collapsed') {
            this.sidebarOpen = true;
        }
    };
    AdminSidebarComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-admin-sidebar',
            templateUrl: './admin-sidebar.component.html',
            styleUrls: ['./admin-sidebar.component.scss'],
            animations: [slideHorizontal, slideSidebar]
        }),
        tslib_1.__metadata("design:paramtypes", [MenuService,
            Injector,
            CSSVariableService,
            AuthService,
            NgbModal])
    ], AdminSidebarComponent);
    return AdminSidebarComponent;
}(MenuComponent));
export { AdminSidebarComponent };
//# sourceMappingURL=admin-sidebar.component.js.map
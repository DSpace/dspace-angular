import * as tslib_1 from "tslib";
import { Component, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { hasValue } from '../shared/empty.util';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';
/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
var HeaderNavbarWrapperComponent = /** @class */ (function () {
    function HeaderNavbarWrapperComponent(store, menuService) {
        this.store = store;
        this.menuService = menuService;
        this.isOpen = false;
        this.menuID = MenuID.PUBLIC;
    }
    HeaderNavbarWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isNavBarCollapsed = this.menuService.isMenuCollapsed(this.menuID);
        this.sub = this.isNavBarCollapsed.subscribe(function (isCollapsed) { return _this.isOpen = !isCollapsed; });
    };
    HeaderNavbarWrapperComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        HostBinding('class.open'),
        tslib_1.__metadata("design:type", Object)
    ], HeaderNavbarWrapperComponent.prototype, "isOpen", void 0);
    HeaderNavbarWrapperComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-header-navbar-wrapper',
            styleUrls: ['header-navbar-wrapper.component.scss'],
            templateUrl: 'header-navbar-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            MenuService])
    ], HeaderNavbarWrapperComponent);
    return HeaderNavbarWrapperComponent;
}());
export { HeaderNavbarWrapperComponent };
//# sourceMappingURL=header-navbar-wrapper.component.js.map
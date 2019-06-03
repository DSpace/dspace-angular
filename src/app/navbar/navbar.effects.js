import * as tslib_1 from "tslib";
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import { HostWindowActionTypes } from '../shared/host-window.actions';
import { CollapseMenuAction, MenuActionTypes } from '../shared/menu/menu.actions';
import { MenuID } from '../shared/menu/initial-menus-state';
import { MenuService } from '../shared/menu/menu.service';
var NavbarEffects = /** @class */ (function () {
    function NavbarEffects(actions$, menuService) {
        var _this = this;
        this.actions$ = actions$;
        this.menuService = menuService;
        this.menuID = MenuID.PUBLIC;
        /**
         * Effect that collapses the public menu on window resize
         * @type {Observable<CollapseMenuAction>}
         */
        this.resize$ = this.actions$
            .pipe(ofType(HostWindowActionTypes.RESIZE), map(function () { return new CollapseMenuAction(_this.menuID); }));
        /**
         * Effect that collapses the public menu on reroute
         * @type {Observable<CollapseMenuAction>}
         */
        this.routeChange$ = this.actions$
            .pipe(ofType(fromRouter.ROUTER_NAVIGATION), map(function () { return new CollapseMenuAction(_this.menuID); }));
        /**
         * Effect that collapses the public menu when the admin sidebar opens
         * @type {Observable<CollapseMenuAction>}
         */
        this.openAdminSidebar$ = this.actions$
            .pipe(ofType(MenuActionTypes.EXPAND_MENU_PREVIEW), switchMap(function (action) {
            return _this.menuService.getMenu(action.menuID).pipe(first(), map(function (menu) {
                if (menu.id === MenuID.ADMIN) {
                    if (!menu.previewCollapsed && menu.collapsed) {
                        return new CollapseMenuAction(MenuID.PUBLIC);
                    }
                }
                return { type: 'NO_ACTION' };
            }));
        }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], NavbarEffects.prototype, "resize$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], NavbarEffects.prototype, "routeChange$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], NavbarEffects.prototype, "openAdminSidebar$", void 0);
    NavbarEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions, MenuService])
    ], NavbarEffects);
    return NavbarEffects;
}());
export { NavbarEffects };
//# sourceMappingURL=navbar.effects.js.map
import * as tslib_1 from "tslib";
import { map, tap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import { SearchSidebarCollapseAction } from './search-sidebar.actions';
import { URLBaser } from '../../core/url-baser/url-baser';
/**
 * Makes sure that if the user navigates to another route, the sidebar is collapsed
 */
var SearchSidebarEffects = /** @class */ (function () {
    function SearchSidebarEffects(actions$) {
        var _this = this;
        this.actions$ = actions$;
        this.routeChange$ = this.actions$
            .pipe(ofType(fromRouter.ROUTER_NAVIGATION), filter(function (action) { return _this.previousPath !== _this.getBaseUrl(action); }), tap(function (action) {
            _this.previousPath = _this.getBaseUrl(action);
        }), map(function () { return new SearchSidebarCollapseAction(); }));
    }
    SearchSidebarEffects.prototype.getBaseUrl = function (action) {
        /* tslint:disable:no-string-literal */
        var url = action['payload'].routerState.url;
        return new URLBaser(url).toString();
        /* tslint:enable:no-string-literal */
    };
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSidebarEffects.prototype, "routeChange$", void 0);
    SearchSidebarEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions])
    ], SearchSidebarEffects);
    return SearchSidebarEffects;
}());
export { SearchSidebarEffects };
//# sourceMappingURL=search-sidebar.effects.js.map
import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { hasValue } from './empty.util';
import { CSSVariableService } from './sass-helper/sass-helper.service';
export var WidthCategory;
(function (WidthCategory) {
    WidthCategory[WidthCategory["XS"] = 0] = "XS";
    WidthCategory[WidthCategory["SM"] = 1] = "SM";
    WidthCategory[WidthCategory["MD"] = 2] = "MD";
    WidthCategory[WidthCategory["LG"] = 3] = "LG";
    WidthCategory[WidthCategory["XL"] = 4] = "XL";
})(WidthCategory || (WidthCategory = {}));
var hostWindowStateSelector = function (state) { return state.hostWindow; };
var widthSelector = createSelector(hostWindowStateSelector, function (hostWindow) { return hostWindow.width; });
var HostWindowService = /** @class */ (function () {
    function HostWindowService(store, variableService) {
        var _this = this;
        this.store = store;
        this.variableService = variableService;
        this.breakPoints = {};
        /* See _exposed_variables.scss */
        variableService.getAllVariables()
            .subscribe(function (variables) {
            _this.breakPoints.XL_MIN = parseInt(variables.xlMin, 10);
            _this.breakPoints.LG_MIN = parseInt(variables.lgMin, 10);
            _this.breakPoints.MD_MIN = parseInt(variables.mdMin, 10);
            _this.breakPoints.SM_MIN = parseInt(variables.smMin, 10);
        });
    }
    HostWindowService.prototype.getWidthObs = function () {
        return this.store.pipe(select(widthSelector), filter(function (width) { return hasValue(width); }));
    };
    Object.defineProperty(HostWindowService.prototype, "widthCategory", {
        get: function () {
            var _this = this;
            return this.getWidthObs().pipe(map(function (width) {
                if (width < _this.breakPoints.SM_MIN) {
                    return WidthCategory.XS;
                }
                else if (width >= _this.breakPoints.SM_MIN && width < _this.breakPoints.MD_MIN) {
                    return WidthCategory.SM;
                }
                else if (width >= _this.breakPoints.MD_MIN && width < _this.breakPoints.LG_MIN) {
                    return WidthCategory.MD;
                }
                else if (width >= _this.breakPoints.LG_MIN && width < _this.breakPoints.XL_MIN) {
                    return WidthCategory.LG;
                }
                else {
                    return WidthCategory.XL;
                }
            }), distinctUntilChanged());
        },
        enumerable: true,
        configurable: true
    });
    HostWindowService.prototype.isXs = function () {
        return this.widthCategory.pipe(map(function (widthCat) { return widthCat === WidthCategory.XS; }), distinctUntilChanged());
    };
    HostWindowService.prototype.isSm = function () {
        return this.widthCategory.pipe(map(function (widthCat) { return widthCat === WidthCategory.SM; }), distinctUntilChanged());
    };
    HostWindowService.prototype.isMd = function () {
        return this.widthCategory.pipe(map(function (widthCat) { return widthCat === WidthCategory.MD; }), distinctUntilChanged());
    };
    HostWindowService.prototype.isLg = function () {
        return this.widthCategory.pipe(map(function (widthCat) { return widthCat === WidthCategory.LG; }), distinctUntilChanged());
    };
    HostWindowService.prototype.isXl = function () {
        return this.widthCategory.pipe(map(function (widthCat) { return widthCat === WidthCategory.XL; }), distinctUntilChanged());
    };
    HostWindowService.prototype.isXsOrSm = function () {
        return observableCombineLatest(this.isXs(), this.isSm()).pipe(map(function (_a) {
            var isXs = _a[0], isSm = _a[1];
            return isXs || isSm;
        }), distinctUntilChanged());
    };
    HostWindowService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store,
            CSSVariableService])
    ], HostWindowService);
    return HostWindowService;
}());
export { HostWindowService };
//# sourceMappingURL=host-window.service.js.map
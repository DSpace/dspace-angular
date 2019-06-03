import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { hasValue } from '../empty.util';
var MockAdminGuard = /** @class */ (function () {
    function MockAdminGuard() {
    }
    MockAdminGuard.prototype.canActivate = function (route, state) {
        // if being run in browser, enforce 'isAdmin' requirement
        if (typeof window === 'object' && hasValue(window.localStorage)) {
            if (window.localStorage.getItem('isAdmin') === 'true') {
                return true;
            }
            return false;
        }
        return true;
    };
    MockAdminGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    MockAdminGuard = tslib_1.__decorate([
        Injectable()
    ], MockAdminGuard);
    return MockAdminGuard;
}());
export { MockAdminGuard };
//# sourceMappingURL=mock-admin-guard.service.js.map
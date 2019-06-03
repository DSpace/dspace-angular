import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { isEmpty } from '../shared/empty.util';
import { MYDSPACE_ROUTE } from './my-dspace-page.component';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
/**
 * Prevent unauthorized activating and loading of mydspace configuration
 * @class MyDSpaceGuard
 */
var MyDSpaceGuard = /** @class */ (function () {
    /**
     * @constructor
     */
    function MyDSpaceGuard(configurationService, router) {
        this.configurationService = configurationService;
        this.router = router;
    }
    /**
     * True when configuration is valid
     * @method canActivate
     */
    MyDSpaceGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.configurationService.getAvailableConfigurationTypes().pipe(first(), map(function (configurationList) { return _this.validateConfigurationParam(route.queryParamMap.get('configuration'), configurationList); }));
    };
    /**
     * Check if the given configuration is present in the list of those available
     *
     * @param configuration
     *    the configuration to validate
     * @param configurationList
     *    the list of available configuration
     *
     */
    MyDSpaceGuard.prototype.validateConfigurationParam = function (configuration, configurationList) {
        var configurationDefault = configurationList[0];
        if (isEmpty(configuration) || !configurationList.includes(configuration)) {
            // If configuration param is empty or is not included in available configurations redirect to a default configuration value
            var navigationExtras = {
                queryParams: { configuration: configurationDefault }
            };
            this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
            return false;
        }
        else {
            return true;
        }
    };
    MyDSpaceGuard = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [MyDSpaceConfigurationService, Router])
    ], MyDSpaceGuard);
    return MyDSpaceGuard;
}());
export { MyDSpaceGuard };
//# sourceMappingURL=my-dspace.guard.js.map
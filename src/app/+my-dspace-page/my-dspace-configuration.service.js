import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { MyDSpaceConfigurationValueType } from './my-dspace-configuration-value-type';
import { RoleService } from '../core/roles/role.service';
import { SearchConfigurationService } from '../+search-page/search-service/search-configuration.service';
import { RouteService } from '../shared/services/route.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { SearchFixedFilterService } from '../+search-page/search-filters/search-filter/search-fixed-filter.service';
/**
 * Service that performs all actions that have to do with the current mydspace configuration
 */
var MyDSpaceConfigurationService = /** @class */ (function (_super) {
    tslib_1.__extends(MyDSpaceConfigurationService, _super);
    /**
     * Initialize class
     *
     * @param {roleService} roleService
     * @param {SearchFixedFilterService} fixedFilterService
     * @param {RouteService} routeService
     * @param {ActivatedRoute} route
     */
    function MyDSpaceConfigurationService(roleService, fixedFilterService, routeService, route) {
        var _this = _super.call(this, routeService, fixedFilterService, route) || this;
        _this.roleService = roleService;
        _this.fixedFilterService = fixedFilterService;
        _this.routeService = routeService;
        _this.route = route;
        /**
         * Default pagination settings
         */
        _this.defaultPagination = Object.assign(new PaginationComponentOptions(), {
            id: 'mydspace-page',
            pageSize: 10,
            currentPage: 1
        });
        /**
         * Default sort settings
         */
        _this.defaultSort = new SortOptions('dc.date.issued', SortDirection.DESC);
        /**
         * Default configuration parameter setting
         */
        _this.defaultConfiguration = 'workspace';
        /**
         * Default scope setting
         */
        _this.defaultScope = '';
        /**
         * Default query setting
         */
        _this.defaultQuery = '';
        // override parent class initialization
        _this._defaults = null;
        _this.initDefaults();
        _this.isSubmitter$ = _this.roleService.isSubmitter();
        _this.isController$ = _this.roleService.isController();
        _this.isAdmin$ = _this.roleService.isAdmin();
        return _this;
    }
    /**
     * Returns the list of available configuration depend on the user role
     *
     * @return {Observable<MyDSpaceConfigurationValueType[]>}
     *    Emits the available configuration list
     */
    MyDSpaceConfigurationService.prototype.getAvailableConfigurationTypes = function () {
        return combineLatest(this.isSubmitter$, this.isController$, this.isAdmin$).pipe(first(), map(function (_a) {
            var isSubmitter = _a[0], isController = _a[1], isAdmin = _a[2];
            var availableConf = [];
            if (isSubmitter) {
                availableConf.push(MyDSpaceConfigurationValueType.Workspace);
            }
            if (isController || isAdmin) {
                availableConf.push(MyDSpaceConfigurationValueType.Workflow);
            }
            return availableConf;
        }));
    };
    /**
     * Returns the select options for the available configuration list
     *
     * @return {Observable<SearchConfigurationOption[]>}
     *    Emits the select options list
     */
    MyDSpaceConfigurationService.prototype.getAvailableConfigurationOptions = function () {
        return this.getAvailableConfigurationTypes().pipe(first(), map(function (availableConfigurationTypes) {
            var configurationOptions = [];
            availableConfigurationTypes.forEach(function (type) {
                var value = type;
                var label = "mydspace.show." + value;
                configurationOptions.push({ value: value, label: label });
            });
            return configurationOptions;
        }));
    };
    MyDSpaceConfigurationService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RoleService,
            SearchFixedFilterService,
            RouteService,
            ActivatedRoute])
    ], MyDSpaceConfigurationService);
    return MyDSpaceConfigurationService;
}(SearchConfigurationService));
export { MyDSpaceConfigurationService };
//# sourceMappingURL=my-dspace-configuration.service.js.map
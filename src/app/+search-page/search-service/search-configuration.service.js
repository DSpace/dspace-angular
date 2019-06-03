import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest as observableCombineLatest, merge as observableMerge, of as observableOf } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { RouteService } from '../../shared/services/route.service';
import { hasNoValue, hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { RemoteData } from '../../core/data/remote-data';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { SearchFilter } from '../search-filter.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { SearchFixedFilterService } from '../search-filters/search-filter/search-fixed-filter.service';
/**
 * Service that performs all actions that have to do with the current search configuration
 */
var SearchConfigurationService = /** @class */ (function () {
    /**
     * Initialize the search options
     * @param {RouteService} routeService
     * @param {SearchFixedFilterService} fixedFilterService
     * @param {ActivatedRoute} route
     */
    function SearchConfigurationService(routeService, fixedFilterService, route) {
        this.routeService = routeService;
        this.fixedFilterService = fixedFilterService;
        this.route = route;
        /**
         * Default pagination settings
         */
        this.defaultPagination = Object.assign(new PaginationComponentOptions(), {
            id: 'search-page-configuration',
            pageSize: 10,
            currentPage: 1
        });
        /**
         * Default sort settings
         */
        this.defaultSort = new SortOptions('score', SortDirection.DESC);
        /**
         * Default configuration parameter setting
         */
        this.defaultConfiguration = 'default';
        /**
         * Default scope setting
         */
        this.defaultScope = '';
        /**
         * Default query setting
         */
        this.defaultQuery = '';
        /**
         * List of subscriptions to unsubscribe from on destroy
         */
        this.subs = new Array();
        this.initDefaults();
    }
    /**
     * Initialize the search options
     */
    SearchConfigurationService.prototype.initDefaults = function () {
        var _this = this;
        this.defaults
            .pipe(getSucceededRemoteData())
            .subscribe(function (defRD) {
            var defs = defRD.payload;
            _this.paginatedSearchOptions = new BehaviorSubject(defs);
            _this.searchOptions = new BehaviorSubject(defs);
            _this.subs.push(_this.subscribeToSearchOptions(defs));
            _this.subs.push(_this.subscribeToPaginatedSearchOptions(defs));
        });
    };
    /**
     * @returns {Observable<string>} Emits the current configuration string
     */
    SearchConfigurationService.prototype.getCurrentConfiguration = function (defaultConfiguration) {
        return this.routeService.getQueryParameterValue('configuration').pipe(map(function (configuration) {
            return configuration || defaultConfiguration;
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current scope's identifier
     */
    SearchConfigurationService.prototype.getCurrentScope = function (defaultScope) {
        return this.routeService.getQueryParameterValue('scope').pipe(map(function (scope) {
            return scope || defaultScope;
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current query string
     */
    SearchConfigurationService.prototype.getCurrentQuery = function (defaultQuery) {
        return this.routeService.getQueryParameterValue('query').pipe(map(function (query) {
            return query || defaultQuery;
        }));
    };
    /**
     * @returns {Observable<number>} Emits the current DSpaceObject type as a number
     */
    SearchConfigurationService.prototype.getCurrentDSOType = function () {
        return this.routeService.getQueryParameterValue('dsoType').pipe(filter(function (type) { return isNotEmpty(type) && hasValue(DSpaceObjectType[type.toUpperCase()]); }), map(function (type) { return DSpaceObjectType[type.toUpperCase()]; }));
    };
    /**
     * @returns {Observable<string>} Emits the current pagination settings
     */
    SearchConfigurationService.prototype.getCurrentPagination = function (defaultPagination) {
        var page$ = this.routeService.getQueryParameterValue('page');
        var size$ = this.routeService.getQueryParameterValue('pageSize');
        return observableCombineLatest(page$, size$).pipe(map(function (_a) {
            var page = _a[0], size = _a[1];
            return Object.assign(new PaginationComponentOptions(), defaultPagination, {
                currentPage: page || defaultPagination.currentPage,
                pageSize: size || defaultPagination.pageSize
            });
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current sorting settings
     */
    SearchConfigurationService.prototype.getCurrentSort = function (defaultSort) {
        var _this = this;
        var sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
        var sortField$ = this.routeService.getQueryParameterValue('sortField');
        return observableCombineLatest(sortDirection$, sortField$).pipe(map(function (_a) {
            var sortDirection = _a[0], sortField = _a[1];
            // Dirty fix because sometimes the observable value is null somehow
            sortField = _this.route.snapshot.queryParamMap.get('sortField');
            var field = sortField || defaultSort.field;
            var direction = SortDirection[sortDirection] || defaultSort.direction;
            return new SortOptions(field, direction);
        }));
    };
    /**
     * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
     */
    SearchConfigurationService.prototype.getCurrentFilters = function () {
        return this.routeService.getQueryParamsWithPrefix('f.').pipe(map(function (filterParams) {
            if (isNotEmpty(filterParams)) {
                var filters_1 = [];
                Object.keys(filterParams).forEach(function (key) {
                    if (key.endsWith('.min') || key.endsWith('.max')) {
                        var realKey_1 = key.slice(0, -4);
                        if (hasNoValue(filters_1.find(function (f) { return f.key === realKey_1; }))) {
                            var min = filterParams[realKey_1 + '.min'] ? filterParams[realKey_1 + '.min'][0] : '*';
                            var max = filterParams[realKey_1 + '.max'] ? filterParams[realKey_1 + '.max'][0] : '*';
                            filters_1.push(new SearchFilter(realKey_1, ['[' + min + ' TO ' + max + ']']));
                        }
                    }
                    else {
                        filters_1.push(new SearchFilter(key, filterParams[key]));
                    }
                });
                return filters_1;
            }
            return [];
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current fixed filter as a string
     */
    SearchConfigurationService.prototype.getCurrentFixedFilter = function () {
        var _this = this;
        return this.routeService.getRouteParameterValue('filter').pipe(flatMap(function (f) { return _this.fixedFilterService.getQueryByFilterName(f); }));
    };
    /**
     * @returns {Observable<Params>} Emits the current active filters with their values as they are displayed in the frontend URL
     */
    SearchConfigurationService.prototype.getCurrentFrontendFilters = function () {
        return this.routeService.getQueryParamsWithPrefix('f.');
    };
    /**
     * Sets up a subscription to all necessary parameters to make sure the searchOptions emits a new value every time they update
     * @param {SearchOptions} defaults Default values for when no parameters are available
     * @returns {Subscription} The subscription to unsubscribe from
     */
    SearchConfigurationService.prototype.subscribeToSearchOptions = function (defaults) {
        var _this = this;
        return observableMerge(this.getConfigurationPart(defaults.configuration), this.getScopePart(defaults.scope), this.getQueryPart(defaults.query), this.getDSOTypePart(), this.getFiltersPart(), this.getFixedFilterPart()).subscribe(function (update) {
            var currentValue = _this.searchOptions.getValue();
            var updatedValue = Object.assign(currentValue, update);
            _this.searchOptions.next(updatedValue);
        });
    };
    /**
     * Sets up a subscription to all necessary parameters to make sure the paginatedSearchOptions emits a new value every time they update
     * @param {PaginatedSearchOptions} defaults Default values for when no parameters are available
     * @returns {Subscription} The subscription to unsubscribe from
     */
    SearchConfigurationService.prototype.subscribeToPaginatedSearchOptions = function (defaults) {
        var _this = this;
        return observableMerge(this.getPaginationPart(defaults.pagination), this.getSortPart(defaults.sort), this.getConfigurationPart(defaults.configuration), this.getScopePart(defaults.scope), this.getQueryPart(defaults.query), this.getDSOTypePart(), this.getFiltersPart(), this.getFixedFilterPart()).subscribe(function (update) {
            var currentValue = _this.paginatedSearchOptions.getValue();
            var updatedValue = Object.assign(currentValue, update);
            _this.paginatedSearchOptions.next(updatedValue);
        });
    };
    Object.defineProperty(SearchConfigurationService.prototype, "defaults", {
        /**
         * Default values for the Search Options
         */
        get: function () {
            if (hasNoValue(this._defaults)) {
                var options = new PaginatedSearchOptions({
                    pagination: this.defaultPagination,
                    configuration: this.defaultConfiguration,
                    sort: this.defaultSort,
                    scope: this.defaultScope,
                    query: this.defaultQuery
                });
                this._defaults = observableOf(new RemoteData(false, false, true, null, options));
            }
            return this._defaults;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Make sure to unsubscribe from all existing subscription to prevent memory leaks
     */
    SearchConfigurationService.prototype.ngOnDestroy = function () {
        this.subs.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.subs = [];
    };
    /**
     * @returns {Observable<string>} Emits the current configuration settings as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getConfigurationPart = function (defaultConfiguration) {
        return this.getCurrentConfiguration(defaultConfiguration).pipe(map(function (configuration) {
            return { configuration: configuration };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current scope's identifier
     */
    SearchConfigurationService.prototype.getScopePart = function (defaultScope) {
        return this.getCurrentScope(defaultScope).pipe(map(function (scope) {
            return { scope: scope };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getQueryPart = function (defaultQuery) {
        return this.getCurrentQuery(defaultQuery).pipe(map(function (query) {
            return { query: query };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getDSOTypePart = function () {
        return this.getCurrentDSOType().pipe(map(function (dsoType) {
            return { dsoType: dsoType };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current pagination settings as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getPaginationPart = function (defaultPagination) {
        return this.getCurrentPagination(defaultPagination).pipe(map(function (pagination) {
            return { pagination: pagination };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current sorting settings as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getSortPart = function (defaultSort) {
        return this.getCurrentSort(defaultSort).pipe(map(function (sort) {
            return { sort: sort };
        }));
    };
    /**
     * @returns {Observable<Params>} Emits the current active filters as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getFiltersPart = function () {
        return this.getCurrentFilters().pipe(map(function (filters) {
            return { filters: filters };
        }));
    };
    /**
     * @returns {Observable<string>} Emits the current fixed filter as a partial SearchOptions object
     */
    SearchConfigurationService.prototype.getFixedFilterPart = function () {
        return this.getCurrentFixedFilter().pipe(isNotEmptyOperator(), map(function (fixedFilter) {
            return { fixedFilter: fixedFilter };
        }));
    };
    /**
     * Update the fixed filter in paginated and non-paginated search options with a given value
     * @param {string} fixedFilter
     */
    SearchConfigurationService.prototype.updateFixedFilter = function (fixedFilter) {
        var currentPaginatedValue = this.paginatedSearchOptions.getValue();
        var updatedPaginatedValue = Object.assign(currentPaginatedValue, { fixedFilter: fixedFilter });
        this.paginatedSearchOptions.next(updatedPaginatedValue);
        var currentValue = this.searchOptions.getValue();
        var updatedValue = Object.assign(currentValue, { fixedFilter: fixedFilter });
        this.searchOptions.next(updatedValue);
    };
    SearchConfigurationService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RouteService,
            SearchFixedFilterService,
            ActivatedRoute])
    ], SearchConfigurationService);
    return SearchConfigurationService;
}());
export { SearchConfigurationService };
//# sourceMappingURL=search-configuration.service.js.map
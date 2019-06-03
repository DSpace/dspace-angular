import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { mergeMap, map, distinctUntilChanged } from 'rxjs/operators';
import { Injectable, InjectionToken } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { SearchFilterCollapseAction, SearchFilterDecrementPageAction, SearchFilterExpandAction, SearchFilterIncrementPageAction, SearchFilterInitializeAction, SearchFilterResetPageAction, SearchFilterToggleAction } from './search-filter.actions';
import { hasValue, isNotEmpty, } from '../../../shared/empty.util';
import { RouteService } from '../../../shared/services/route.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SearchFixedFilterService } from './search-fixed-filter.service';
// const spy = create();
var filterStateSelector = function (state) { return state.searchFilter; };
export var FILTER_CONFIG = new InjectionToken('filterConfig');
export var IN_PLACE_SEARCH = new InjectionToken('inPlaceSearch');
/**
 * Service that performs all actions that have to do with search filters and facets
 */
var SearchFilterService = /** @class */ (function () {
    function SearchFilterService(store, routeService, fixedFilterService) {
        this.store = store;
        this.routeService = routeService;
        this.fixedFilterService = fixedFilterService;
    }
    /**
     * Checks if a given filter is active with a given value
     * @param {string} paramName The parameter name of the filter's configuration for which to search
     * @param {string} filterValue The value for which to search
     * @returns {Observable<boolean>} Emit true when the filter is active with the given value
     */
    SearchFilterService.prototype.isFilterActiveWithValue = function (paramName, filterValue) {
        return this.routeService.hasQueryParamWithValue(paramName, filterValue);
    };
    /**
     * Checks if a given filter is active with any value
     * @param {string} paramName The parameter name of the filter's configuration for which to search
     * @returns {Observable<boolean>} Emit true when the filter is active with any value
     */
    SearchFilterService.prototype.isFilterActive = function (paramName) {
        return this.routeService.hasQueryParam(paramName);
    };
    /**
     * Fetch the current active scope from the query parameters
     * @returns {Observable<string>}
     */
    SearchFilterService.prototype.getCurrentScope = function () {
        return this.routeService.getQueryParameterValue('scope');
    };
    /**
     * Fetch the current query from the query parameters
     * @returns {Observable<string>}
     */
    SearchFilterService.prototype.getCurrentQuery = function () {
        return this.routeService.getQueryParameterValue('query');
    };
    /**
     * Fetch the current pagination from query parameters 'page' and 'pageSize'
     * and combine them with a given pagination
     * @param pagination      Pagination options to combine the query parameters with
     * @returns {Observable<PaginationComponentOptions>}
     */
    SearchFilterService.prototype.getCurrentPagination = function (pagination) {
        if (pagination === void 0) { pagination = {}; }
        var page$ = this.routeService.getQueryParameterValue('page');
        var size$ = this.routeService.getQueryParameterValue('pageSize');
        return observableCombineLatest(page$, size$).pipe(map(function (_a) {
            var page = _a[0], size = _a[1];
            return Object.assign(new PaginationComponentOptions(), pagination, {
                currentPage: page || 1,
                pageSize: size || pagination.pageSize
            });
        }));
    };
    /**
     * Fetch the current sorting options from query parameters 'sortDirection' and 'sortField'
     * and combine them with given sorting options
     * @param {SortOptions} defaultSort       Sorting options to combine the query parameters with
     * @returns {Observable<SortOptions>}
     */
    SearchFilterService.prototype.getCurrentSort = function (defaultSort) {
        var sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
        var sortField$ = this.routeService.getQueryParameterValue('sortField');
        return observableCombineLatest(sortDirection$, sortField$).pipe(map(function (_a) {
            var sortDirection = _a[0], sortField = _a[1];
            var field = sortField || defaultSort.field;
            var direction = SortDirection[sortDirection] || defaultSort.direction;
            return new SortOptions(field, direction);
        }));
    };
    /**
     * Fetch the current active filters from the query parameters
     * @returns {Observable<Params>}
     */
    SearchFilterService.prototype.getCurrentFilters = function () {
        return this.routeService.getQueryParamsWithPrefix('f.');
    };
    /**
     * Fetch the current active fixed filter from the route parameters and return the query by filter name
     * @returns {Observable<string>}
     */
    SearchFilterService.prototype.getCurrentFixedFilter = function () {
        var _this = this;
        var filter = this.routeService.getRouteParameterValue('filter');
        return filter.pipe(mergeMap(function (f) { return _this.fixedFilterService.getQueryByFilterName(f); }));
    };
    /**
     * Fetch the current view from the query parameters
     * @returns {Observable<string>}
     */
    SearchFilterService.prototype.getCurrentView = function () {
        return this.routeService.getQueryParameterValue('view');
    };
    /**
     * Requests the active filter values set for a given filter
     * @param {SearchFilterConfig} filterConfig The configuration for which the filters are active
     * @returns {Observable<string[]>} Emits the active filters for the given filter configuration
     */
    SearchFilterService.prototype.getSelectedValuesForFilter = function (filterConfig) {
        var values$ = this.routeService.getQueryParameterValues(filterConfig.paramName);
        var prefixValues$ = this.routeService.getQueryParamsWithPrefix(filterConfig.paramName + '.').pipe(map(function (params) { return [].concat.apply([], Object.values(params)); }));
        return observableCombineLatest(values$, prefixValues$).pipe(map(function (_a) {
            var values = _a[0], prefixValues = _a[1];
            if (isNotEmpty(values)) {
                return values;
            }
            return prefixValues;
        }));
    };
    /**
     * Checks if the state of a given filter is currently collapsed or not
     * @param {string} filterName The filtername for which the collapsed state is checked
     * @returns {Observable<boolean>} Emits the current collapsed state of the given filter, if it's unavailable, return false
     */
    SearchFilterService.prototype.isCollapsed = function (filterName) {
        return this.store.pipe(select(filterByNameSelector(filterName)), map(function (object) {
            if (object) {
                return object.filterCollapsed;
            }
            else {
                return false;
            }
        }), distinctUntilChanged());
    };
    /**
     * Request the current page of a given filter
     * @param {string} filterName The filter name for which the page state is checked
     * @returns {Observable<boolean>} Emits the current page state of the given filter, if it's unavailable, return 1
     */
    SearchFilterService.prototype.getPage = function (filterName) {
        return this.store.pipe(select(filterByNameSelector(filterName)), map(function (object) {
            if (object) {
                return object.page;
            }
            else {
                return 1;
            }
        }), distinctUntilChanged());
    };
    /**
     * Dispatches a collapse action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.collapse = function (filterName) {
        this.store.dispatch(new SearchFilterCollapseAction(filterName));
    };
    /**
     * Dispatches an expand action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.expand = function (filterName) {
        this.store.dispatch(new SearchFilterExpandAction(filterName));
    };
    /**
     * Dispatches a toggle action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.toggle = function (filterName) {
        this.store.dispatch(new SearchFilterToggleAction(filterName));
    };
    /**
     * Dispatches an initialize action to the store for a given filter
     * @param {SearchFilterConfig} filter The filter for which the action is dispatched
     */
    SearchFilterService.prototype.initializeFilter = function (filter) {
        this.store.dispatch(new SearchFilterInitializeAction(filter));
    };
    /**
     * Dispatches a decrement action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.decrementPage = function (filterName) {
        this.store.dispatch(new SearchFilterDecrementPageAction(filterName));
    };
    /**
     * Dispatches an increment page action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.incrementPage = function (filterName) {
        this.store.dispatch(new SearchFilterIncrementPageAction(filterName));
    };
    /**
     * Dispatches a reset page action to the store for a given filter
     * @param {string} filterName The filter for which the action is dispatched
     */
    SearchFilterService.prototype.resetPage = function (filterName) {
        this.store.dispatch(new SearchFilterResetPageAction(filterName));
    };
    SearchFilterService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store,
            RouteService,
            SearchFixedFilterService])
    ], SearchFilterService);
    return SearchFilterService;
}());
export { SearchFilterService };
function filterByNameSelector(name) {
    return keySelector(name);
}
export function keySelector(key) {
    return createSelector(filterStateSelector, function (state) {
        if (hasValue(state)) {
            return state[key];
        }
        else {
            return undefined;
        }
    });
}
//# sourceMappingURL=search-filter.service.js.map
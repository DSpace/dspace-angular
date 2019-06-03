import * as tslib_1 from "tslib";
import { Component, Inject, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { SearchService } from '../search-service/search.service';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SearchFilterService } from './search-filter/search-filter.service';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';
var SearchFiltersComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     * @param {SearchService} searchService
     * @param {SearchConfigurationService} searchConfigService
     * @param {SearchFilterService} filterService
     */
    function SearchFiltersComponent(searchService, filterService, searchConfigService) {
        this.searchService = searchService;
        this.filterService = filterService;
        this.searchConfigService = searchConfigService;
    }
    SearchFiltersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filters = this.searchConfigService.searchOptions.pipe(switchMap(function (options) { return _this.searchService.getConfig(options.scope, options.configuration).pipe(getSucceededRemoteData()); }));
        this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(map(function (filters) {
            Object.keys(filters).forEach(function (f) { return filters[f] = null; });
            return filters;
        }));
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFiltersComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * Prevent unnecessary rerendering
     */
    SearchFiltersComponent.prototype.trackUpdate = function (index, config) {
        return config ? config.name : undefined;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFiltersComponent.prototype, "inPlaceSearch", void 0);
    SearchFiltersComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-filters',
            styleUrls: ['./search-filters.component.scss'],
            templateUrl: './search-filters.component.html',
        })
        /**
         * This component represents the part of the search sidebar that contains filters.
         */
        ,
        tslib_1.__param(2, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            SearchConfigurationService])
    ], SearchFiltersComponent);
    return SearchFiltersComponent;
}());
export { SearchFiltersComponent };
//# sourceMappingURL=search-filters.component.js.map
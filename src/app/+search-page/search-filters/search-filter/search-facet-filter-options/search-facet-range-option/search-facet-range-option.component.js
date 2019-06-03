import * as tslib_1 from "tslib";
import { map } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { RANGE_FILTER_MAX_SUFFIX, RANGE_FILTER_MIN_SUFFIX } from '../../search-range-filter/search-range-filter.component';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { hasValue } from '../../../../../shared/empty.util';
var rangeDelimiter = '-';
var SearchFacetRangeOptionComponent = /** @class */ (function () {
    function SearchFacetRangeOptionComponent(searchService, filterService, searchConfigService, router) {
        this.searchService = searchService;
        this.filterService = filterService;
        this.searchConfigService = searchConfigService;
        this.router = router;
    }
    /**
     * Initializes all observable instance variables and starts listening to them
     */
    SearchFacetRangeOptionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isVisible = this.isChecked().pipe(map(function (checked) { return !checked; }));
        this.sub = this.searchConfigService.searchOptions.subscribe(function () {
            _this.updateChangeParams();
        });
    };
    /**
     * Checks if a value for this filter is currently active
     */
    SearchFacetRangeOptionComponent.prototype.isChecked = function () {
        return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.filterValue.value);
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFacetRangeOptionComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * Calculates the parameters that should change if a given values for this range filter would be changed
     */
    SearchFacetRangeOptionComponent.prototype.updateChangeParams = function () {
        var _a;
        var parts = this.filterValue.value.split(rangeDelimiter);
        var min = parts.length > 1 ? parts[0].trim() : this.filterValue.value;
        var max = parts.length > 1 ? parts[1].trim() : this.filterValue.value;
        this.changeQueryParams = (_a = {},
            _a[this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX] = [min],
            _a[this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX] = [max],
            _a.page = 1,
            _a);
    };
    /**
     * Make sure the subscription is unsubscribed from when this component is destroyed
     */
    SearchFacetRangeOptionComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FacetValue)
    ], SearchFacetRangeOptionComponent.prototype, "filterValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchFilterConfig)
    ], SearchFacetRangeOptionComponent.prototype, "filterConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFacetRangeOptionComponent.prototype, "inPlaceSearch", void 0);
    SearchFacetRangeOptionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-facet-range-option',
            styleUrls: ['./search-facet-range-option.component.scss'],
            templateUrl: './search-facet-range-option.component.html',
        })
        /**
         * Represents a single option in a range filter facet
         */
        ,
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            SearchConfigurationService,
            Router])
    ], SearchFacetRangeOptionComponent);
    return SearchFacetRangeOptionComponent;
}());
export { SearchFacetRangeOptionComponent };
//# sourceMappingURL=search-facet-range-option.component.js.map
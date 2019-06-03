import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { hasValue } from '../../../../../shared/empty.util';
import { FilterType } from '../../../../search-service/filter-type.model';
var SearchFacetOptionComponent = /** @class */ (function () {
    function SearchFacetOptionComponent(searchService, filterService, searchConfigService, router) {
        this.searchService = searchService;
        this.filterService = filterService;
        this.searchConfigService = searchConfigService;
        this.router = router;
    }
    /**
     * Initializes all observable instance variables and starts listening to them
     */
    SearchFacetOptionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isVisible = this.isChecked().pipe(map(function (checked) { return !checked; }));
        this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
            .subscribe(function (_a) {
            var selectedValues = _a[0], searchOptions = _a[1];
            _this.updateAddParams(selectedValues);
        });
    };
    /**
     * Checks if a value for this filter is currently active
     */
    SearchFacetOptionComponent.prototype.isChecked = function () {
        return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.getFacetValue());
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFacetOptionComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * Calculates the parameters that should change if a given value for this filter would be added to the active filters
     * @param {string[]} selectedValues The values that are currently selected for this filter
     */
    SearchFacetOptionComponent.prototype.updateAddParams = function (selectedValues) {
        var _a;
        this.addQueryParams = (_a = {},
            _a[this.filterConfig.paramName] = selectedValues.map(function (facetValue) { return facetValue.label; }).concat([this.getFacetValue()]),
            _a.page = 1,
            _a);
    };
    /**
     * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
     * Retrieve facet value related to facet type
     */
    SearchFacetOptionComponent.prototype.getFacetValue = function () {
        if (this.filterConfig.type === FilterType.authority) {
            var search = this.filterValue.search;
            var hashes = search.slice(search.indexOf('?') + 1).split('&');
            var params_1 = {};
            hashes.map(function (hash) {
                var _a = hash.split('='), key = _a[0], val = _a[1];
                params_1[key] = decodeURIComponent(val);
            });
            return params_1[this.filterConfig.paramName];
        }
        else {
            return this.filterValue.value;
        }
    };
    /**
     * Make sure the subscription is unsubscribed from when this component is destroyed
     */
    SearchFacetOptionComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FacetValue)
    ], SearchFacetOptionComponent.prototype, "filterValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchFilterConfig)
    ], SearchFacetOptionComponent.prototype, "filterConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], SearchFacetOptionComponent.prototype, "selectedValues$", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFacetOptionComponent.prototype, "inPlaceSearch", void 0);
    SearchFacetOptionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-facet-option',
            styleUrls: ['./search-facet-option.component.scss'],
            templateUrl: './search-facet-option.component.html',
        })
        /**
         * Represents a single option in a filter facet
         */
        ,
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            SearchConfigurationService,
            Router])
    ], SearchFacetOptionComponent);
    return SearchFacetOptionComponent;
}());
export { SearchFacetOptionComponent };
//# sourceMappingURL=search-facet-option.component.js.map
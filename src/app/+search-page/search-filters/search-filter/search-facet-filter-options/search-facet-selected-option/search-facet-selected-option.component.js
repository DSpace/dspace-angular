import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { hasValue } from '../../../../../shared/empty.util';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { FilterType } from '../../../../search-service/filter-type.model';
var SearchFacetSelectedOptionComponent = /** @class */ (function () {
    function SearchFacetSelectedOptionComponent(searchService, filterService, searchConfigService, router) {
        this.searchService = searchService;
        this.filterService = filterService;
        this.searchConfigService = searchConfigService;
        this.router = router;
    }
    /**
     * Initializes all observable instance variables and starts listening to them
     */
    SearchFacetSelectedOptionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
            .subscribe(function (_a) {
            var selectedValues = _a[0], searchOptions = _a[1];
            _this.updateRemoveParams(selectedValues);
        });
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFacetSelectedOptionComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
     * @param {string[]} selectedValues The values that are currently selected for this filter
     */
    SearchFacetSelectedOptionComponent.prototype.updateRemoveParams = function (selectedValues) {
        var _this = this;
        var _a;
        this.removeQueryParams = (_a = {},
            _a[this.filterConfig.paramName] = selectedValues
                .filter(function (facetValue) { return facetValue.label !== _this.selectedValue.label; })
                .map(function (facetValue) { return _this.getFacetValue(facetValue); }),
            _a.page = 1,
            _a);
    };
    /**
     * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
     * Retrieve facet value related to facet type
     */
    SearchFacetSelectedOptionComponent.prototype.getFacetValue = function (facetValue) {
        if (this.filterConfig.type === FilterType.authority) {
            var search = facetValue.search;
            var hashes = search.slice(search.indexOf('?') + 1).split('&');
            var params_1 = {};
            hashes.map(function (hash) {
                var _a = hash.split('='), key = _a[0], val = _a[1];
                params_1[key] = decodeURIComponent(val);
            });
            return params_1[this.filterConfig.paramName];
        }
        else {
            return facetValue.value;
        }
    };
    /**
     * Make sure the subscription is unsubscribed from when this component is destroyed
     */
    SearchFacetSelectedOptionComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FacetValue)
    ], SearchFacetSelectedOptionComponent.prototype, "selectedValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchFilterConfig)
    ], SearchFacetSelectedOptionComponent.prototype, "filterConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], SearchFacetSelectedOptionComponent.prototype, "selectedValues$", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFacetSelectedOptionComponent.prototype, "inPlaceSearch", void 0);
    SearchFacetSelectedOptionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-facet-selected-option',
            styleUrls: ['./search-facet-selected-option.component.scss'],
            templateUrl: './search-facet-selected-option.component.html',
        })
        /**
         * Represents a single selected option in a filter facet
         */
        ,
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            SearchConfigurationService,
            Router])
    ], SearchFacetSelectedOptionComponent);
    return SearchFacetSelectedOptionComponent;
}());
export { SearchFacetSelectedOptionComponent };
//# sourceMappingURL=search-facet-selected-option.component.js.map
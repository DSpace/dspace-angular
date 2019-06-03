import * as tslib_1 from "tslib";
import { Component, Inject, Input } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';
var SearchLabelsComponent = /** @class */ (function () {
    /**
     * Initialize the instance variable
     */
    function SearchLabelsComponent(searchService, searchConfigService) {
        this.searchService = searchService;
        this.searchConfigService = searchConfigService;
        this.appliedFilters = this.searchConfigService.getCurrentFrontendFilters();
    }
    /**
     * Calculates the parameters that should change if a given value for the given filter would be removed from the active filters
     * @param {string} filterField The filter field parameter name from which the value should be removed
     * @param {string} filterValue The value that is removed for this given filter field
     * @returns {Observable<Params>} The changed filter parameters
     */
    SearchLabelsComponent.prototype.getRemoveParams = function (filterField, filterValue) {
        return this.appliedFilters.pipe(map(function (filters) {
            var _a;
            var field = Object.keys(filters).find(function (f) { return f === filterField; });
            var newValues = hasValue(filters[field]) ? filters[field].filter(function (v) { return v !== filterValue; }) : null;
            return _a = {},
                _a[field] = isNotEmpty(newValues) ? newValues : null,
                _a.page = 1,
                _a;
        }));
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchLabelsComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
     * Strips authority operator from filter value
     * e.g. 'test ,authority' => 'test'
     *
     * @param value
     */
    SearchLabelsComponent.prototype.normalizeFilterValue = function (value) {
        // const pattern = /,[^,]*$/g;
        var pattern = /,authority*$/g;
        return value.replace(pattern, '');
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchLabelsComponent.prototype, "inPlaceSearch", void 0);
    SearchLabelsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-labels',
            styleUrls: ['./search-labels.component.scss'],
            templateUrl: './search-labels.component.html',
        })
        /**
         * Component that represents the labels containing the currently active filters
         */
        ,
        tslib_1.__param(1, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchConfigurationService])
    ], SearchLabelsComponent);
    return SearchLabelsComponent;
}());
export { SearchLabelsComponent };
//# sourceMappingURL=search-labels.component.js.map
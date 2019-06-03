import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SearchFilterService } from '../search-filter.service';
import { SearchService } from '../../../search-service/search.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RouteService } from '../../../../shared/services/route.service';
import { hasValue } from '../../../../shared/empty.util';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../+my-dspace-page/my-dspace-page.component';
/**
 * The suffix for a range filters' minimum in the frontend URL
 */
export var RANGE_FILTER_MIN_SUFFIX = '.min';
/**
 * The suffix for a range filters' maximum in the frontend URL
 */
export var RANGE_FILTER_MAX_SUFFIX = '.max';
/**
 * The date formats that are possible to appear in a date filter
 */
var dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var SearchRangeFilterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchRangeFilterComponent, _super);
    function SearchRangeFilterComponent(searchService, filterService, router, rdbs, searchConfigService, inPlaceSearch, filterConfig, platformId, route) {
        var _this = _super.call(this, searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig) || this;
        _this.searchService = searchService;
        _this.filterService = filterService;
        _this.router = router;
        _this.rdbs = rdbs;
        _this.searchConfigService = searchConfigService;
        _this.inPlaceSearch = inPlaceSearch;
        _this.filterConfig = filterConfig;
        _this.platformId = platformId;
        _this.route = route;
        /**
         * Fallback minimum for the range
         */
        _this.min = 1950;
        /**
         * Fallback maximum for the range
         */
        _this.max = 2018;
        return _this;
    }
    /**
     * Initialize with the min and max values as configured in the filter configuration
     * Set the initial values of the range
     */
    SearchRangeFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.min = moment(this.filterConfig.minValue, dateFormats).year() || this.min;
        this.max = moment(this.filterConfig.maxValue, dateFormats).year() || this.max;
        var iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
        var iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));
        this.sub = observableCombineLatest(iniMin, iniMax).pipe(map(function (_a) {
            var min = _a[0], max = _a[1];
            var minimum = hasValue(min) ? min : _this.min;
            var maximum = hasValue(max) ? max : _this.max;
            return [minimum, maximum];
        })).subscribe(function (minmax) { return _this.range = minmax; });
    };
    /**
     * Submits new custom range values to the range filter from the widget
     */
    SearchRangeFilterComponent.prototype.onSubmit = function () {
        var _a;
        var newMin = this.range[0] !== this.min ? [this.range[0]] : null;
        var newMax = this.range[1] !== this.max ? [this.range[1]] : null;
        this.router.navigate(this.getSearchLinkParts(), {
            queryParams: (_a = {},
                _a[this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX] = newMin,
                _a[this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX] = newMax,
                _a),
            queryParamsHandling: 'merge'
        });
        this.filter = '';
    };
    /**
     * TODO when upgrading nouislider, verify that this check is still needed.
     * Prevents AoT bug
     * @returns {boolean} True if the platformId is a platform browser
     */
    SearchRangeFilterComponent.prototype.shouldShowSlider = function () {
        return isPlatformBrowser(this.platformId);
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SearchRangeFilterComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    SearchRangeFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-range-filter',
            styleUrls: ['./search-range-filter.component.scss'],
            templateUrl: './search-range-filter.component.html',
            animations: [facetLoad]
        })
        /**
         * Component that represents a range facet for a specific filter configuration
         */
        ,
        renderFacetFor(FilterType.range),
        tslib_1.__param(4, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__param(5, Inject(IN_PLACE_SEARCH)),
        tslib_1.__param(6, Inject(FILTER_CONFIG)),
        tslib_1.__param(7, Inject(PLATFORM_ID)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            Router,
            RemoteDataBuildService,
            SearchConfigurationService, Boolean, SearchFilterConfig, Object, RouteService])
    ], SearchRangeFilterComponent);
    return SearchRangeFilterComponent;
}(SearchFacetFilterComponent));
export { SearchRangeFilterComponent };
//# sourceMappingURL=search-range-filter.component.js.map
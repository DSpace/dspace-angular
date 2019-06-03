import * as tslib_1 from "tslib";
import { Component, Inject, Input } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchFilterService } from './search-filter.service';
import { slide } from '../../../shared/animations/slide';
import { isNotEmpty } from '../../../shared/empty.util';
import { SearchService } from '../../search-service/search.service';
import { SearchConfigurationService } from '../../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';
var SearchFilterComponent = /** @class */ (function () {
    function SearchFilterComponent(filterService, searchService, searchConfigService) {
        this.filterService = filterService;
        this.searchService = searchService;
        this.searchConfigService = searchConfigService;
        /**
         * True when the filter is 100% collapsed in the UI
         */
        this.closed = true;
    }
    /**
     * Requests the current set values for this filter
     * If the filter config is open by default OR the filter has at least one value, the filter should be initially expanded
     * Else, the filter should initially be collapsed
     */
    SearchFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.selectedValues$ = this.getSelectedValues();
        this.active$ = this.isActive();
        this.collapsed$ = this.isCollapsed();
        this.initializeFilter();
        this.selectedValues$.pipe(take(1)).subscribe(function (selectedValues) {
            if (isNotEmpty(selectedValues)) {
                _this.filterService.expand(_this.filter.name);
            }
        });
    };
    /**
     *  Changes the state for this filter to collapsed when it's expanded and to expanded it when it's collapsed
     */
    SearchFilterComponent.prototype.toggle = function () {
        this.filterService.toggle(this.filter.name);
    };
    /**
     * Checks if the filter is currently collapsed
     * @returns {Observable<boolean>} Emits true when the current state of the filter is collapsed, false when it's expanded
     */
    SearchFilterComponent.prototype.isCollapsed = function () {
        return this.filterService.isCollapsed(this.filter.name);
    };
    /**
     *  Sets the initial state of the filter
     */
    SearchFilterComponent.prototype.initializeFilter = function () {
        this.filterService.initializeFilter(this.filter);
    };
    /**
     * @returns {Observable<string[]>} Emits a list of all values that are currently active for this filter
     */
    SearchFilterComponent.prototype.getSelectedValues = function () {
        return this.filterService.getSelectedValuesForFilter(this.filter);
    };
    /**
     * Method to change this.collapsed to false when the slide animation ends and is sliding open
     * @param event The animation event
     */
    SearchFilterComponent.prototype.finishSlide = function (event) {
        if (event.fromState === 'collapsed') {
            this.closed = false;
        }
    };
    /**
     * Method to change this.collapsed to true when the slide animation starts and is sliding closed
     * @param event The animation event
     */
    SearchFilterComponent.prototype.startSlide = function (event) {
        if (event.toState === 'collapsed') {
            this.closed = true;
        }
    };
    /**
     * Check if a given filter is supposed to be shown or not
     * @returns {Observable<boolean>} Emits true whenever a given filter config should be shown
     */
    SearchFilterComponent.prototype.isActive = function () {
        var _this = this;
        return this.selectedValues$.pipe(switchMap(function (isActive) {
            if (isNotEmpty(isActive)) {
                return observableOf(true);
            }
            else {
                return _this.searchConfigService.searchOptions.pipe(switchMap(function (options) {
                    return _this.searchService.getFacetValuesFor(_this.filter, 1, options).pipe(filter(function (RD) { return !RD.isLoading; }), map(function (valuesRD) {
                        return valuesRD.payload.totalElements > 0;
                    }));
                }));
            }
        }), startWith(true));
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchFilterConfig)
    ], SearchFilterComponent.prototype, "filter", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFilterComponent.prototype, "inPlaceSearch", void 0);
    SearchFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-filter',
            styleUrls: ['./search-filter.component.scss'],
            templateUrl: './search-filter.component.html',
            animations: [slide],
        })
        /**
         * Represents a part of the filter section for a single type of filter
         */
        ,
        tslib_1.__param(2, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchFilterService,
            SearchService,
            SearchConfigurationService])
    ], SearchFilterComponent);
    return SearchFilterComponent;
}());
export { SearchFilterComponent };
//# sourceMappingURL=search-filter.component.js.map
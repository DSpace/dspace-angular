import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest, of as observableOf, BehaviorSubject } from 'rxjs';
import { switchMap, distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { EmphasizePipe } from '../../../../shared/utils/emphasize.pipe';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { SearchService } from '../../../search-service/search.service';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SearchFilterService } from '../search-filter.service';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';
import { getSucceededRemoteData } from '../../../../core/shared/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../../+my-dspace-page/my-dspace-page.component';
var SearchFacetFilterComponent = /** @class */ (function () {
    function SearchFacetFilterComponent(searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig) {
        this.searchService = searchService;
        this.filterService = filterService;
        this.rdbs = rdbs;
        this.router = router;
        this.searchConfigService = searchConfigService;
        this.inPlaceSearch = inPlaceSearch;
        this.filterConfig = filterConfig;
        /**
         * Emits true if the current page is also the last page available
         */
        this.isLastPage$ = new BehaviorSubject(false);
        /**
         * List of subscriptions to unsubscribe from
         */
        this.subs = [];
        /**
         * Emits the result values for this filter found by the current filter query
         */
        this.filterSearchResults = observableOf([]);
        this.collapseNextUpdate = true;
        /**
         * State of the requested facets used to time the animation
         */
        this.animationState = 'loading';
    }
    /**
     * Initializes all observable instance variables and starts listening to them
     */
    SearchFacetFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterValues$ = new BehaviorSubject(new RemoteData(true, false, undefined, undefined, undefined));
        this.currentPage = this.getCurrentPage().pipe(distinctUntilChanged());
        this.searchOptions$ = this.searchConfigService.searchOptions;
        this.subs.push(this.searchOptions$.subscribe(function () { return _this.updateFilterValueList(); }));
        var facetValues$ = observableCombineLatest(this.searchOptions$, this.currentPage).pipe(map(function (_a) {
            var options = _a[0], page = _a[1];
            return { options: options, page: page };
        }), switchMap(function (_a) {
            var options = _a.options, page = _a.page;
            return _this.searchService.getFacetValuesFor(_this.filterConfig, page, options)
                .pipe(getSucceededRemoteData(), map(function (results) {
                return {
                    values: observableOf(results),
                    page: page
                };
            }));
        }));
        var filterValues = [];
        this.subs.push(facetValues$.subscribe(function (facetOutcome) {
            var newValues$ = facetOutcome.values;
            if (_this.collapseNextUpdate) {
                _this.showFirstPageOnly();
                facetOutcome.page = 1;
                _this.collapseNextUpdate = false;
            }
            if (facetOutcome.page === 1) {
                filterValues = [];
            }
            filterValues = filterValues.concat([newValues$]);
            _this.subs.push(_this.rdbs.aggregate(filterValues).pipe(tap(function (rd) {
                _this.selectedValues$ = _this.filterService.getSelectedValuesForFilter(_this.filterConfig).pipe(map(function (selectedValues) {
                    return selectedValues.map(function (value) {
                        var fValue = [].concat.apply([], rd.payload.map(function (page) { return page.page; })).find(function (facetValue) { return facetValue.value === value; });
                        if (hasValue(fValue)) {
                            return fValue;
                        }
                        return Object.assign(new FacetValue(), { label: value, value: value });
                    });
                }));
            })).subscribe(function (rd) {
                _this.animationState = 'ready';
                _this.filterValues$.next(rd);
            }));
            _this.subs.push(newValues$.pipe(take(1)).subscribe(function (rd) {
                _this.isLastPage$.next(hasNoValue(rd.payload.next));
            }));
        }));
    };
    /**
     * Prepare for refreshing the values of this filter
     */
    SearchFacetFilterComponent.prototype.updateFilterValueList = function () {
        this.animationState = 'loading';
        this.collapseNextUpdate = true;
        this.filter = '';
    };
    /**
     * Checks if a value for this filter is currently active
     */
    SearchFacetFilterComponent.prototype.isChecked = function (value) {
        return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, value.value);
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFacetFilterComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
     */
    SearchFacetFilterComponent.prototype.getSearchLinkParts = function () {
        if (this.inPlaceSearch) {
            return [];
        }
        return this.getSearchLink().split('/');
    };
    /**
     * Show the next page as well
     */
    SearchFacetFilterComponent.prototype.showMore = function () {
        this.filterService.incrementPage(this.filterConfig.name);
    };
    /**
     * Make sure only the first page is shown
     */
    SearchFacetFilterComponent.prototype.showFirstPageOnly = function () {
        this.filterService.resetPage(this.filterConfig.name);
    };
    /**
     * @returns {Observable<number>} The current page of this filter
     */
    SearchFacetFilterComponent.prototype.getCurrentPage = function () {
        return this.filterService.getPage(this.filterConfig.name);
    };
    /**
     * @returns {string} the current URL
     */
    SearchFacetFilterComponent.prototype.getCurrentUrl = function () {
        return this.router.url;
    };
    /**
     * Submits a new active custom value to the filter from the input field
     * @param data The string from the input field
     */
    SearchFacetFilterComponent.prototype.onSubmit = function (data) {
        var _this = this;
        this.selectedValues$.pipe(take(1)).subscribe(function (selectedValues) {
            var _a;
            if (isNotEmpty(data)) {
                _this.router.navigate(_this.getSearchLinkParts(), {
                    queryParams: (_a = {},
                        _a[_this.filterConfig.paramName] = selectedValues.map(function (facet) { return _this.getFacetValue(facet); }).concat([
                            data
                        ]),
                        _a),
                    queryParamsHandling: 'merge'
                });
                _this.filter = '';
            }
            _this.filterSearchResults = observableOf([]);
        });
    };
    /**
     * On click, set the input's value to the clicked data
     * @param data The value of the option that was clicked
     */
    SearchFacetFilterComponent.prototype.onClick = function (data) {
        this.filter = data;
    };
    /**
     * For usage of the hasValue function in the template
     */
    SearchFacetFilterComponent.prototype.hasValue = function (o) {
        return hasValue(o);
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SearchFacetFilterComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
    };
    /**
     * Updates the found facet value suggestions for a given query
     * Transforms the found values into display values
     * @param data The query for which is being searched
     */
    SearchFacetFilterComponent.prototype.findSuggestions = function (data) {
        var _this = this;
        if (isNotEmpty(data)) {
            this.searchOptions$.pipe(take(1)).subscribe(function (options) {
                _this.filterSearchResults = _this.searchService.getFacetValuesFor(_this.filterConfig, 1, options, data.toLowerCase())
                    .pipe(getSucceededRemoteData(), map(function (rd) {
                    return rd.payload.page.map(function (facet) {
                        return {
                            displayValue: _this.getDisplayValue(facet, data),
                            value: _this.getFacetValue(facet)
                        };
                    });
                }));
            });
        }
        else {
            this.filterSearchResults = observableOf([]);
        }
    };
    /**
     * Retrieve facet value
     */
    SearchFacetFilterComponent.prototype.getFacetValue = function (facet) {
        return facet.value;
    };
    /**
     * Transforms the facet value string, so if the query matches part of the value, it's emphasized in the value
     * @param {FacetValue} facet The value of the facet as returned by the server
     * @param {string} query The query that was used to search facet values
     * @returns {string} The facet value with the query part emphasized
     */
    SearchFacetFilterComponent.prototype.getDisplayValue = function (facet, query) {
        return new EmphasizePipe().transform(facet.value, query) + ' (' + facet.count + ')';
    };
    /**
     * Prevent unnecessary rerendering
     */
    SearchFacetFilterComponent.prototype.trackUpdate = function (index, value) {
        return value ? value.search : undefined;
    };
    SearchFacetFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-facet-filter',
            template: "",
        })
        /**
         * Super class for all different representations of facets
         */
        ,
        tslib_1.__param(4, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__param(5, Inject(IN_PLACE_SEARCH)),
        tslib_1.__param(6, Inject(FILTER_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchFilterService,
            RemoteDataBuildService,
            Router,
            SearchConfigurationService, Boolean, SearchFilterConfig])
    ], SearchFacetFilterComponent);
    return SearchFacetFilterComponent;
}());
export { SearchFacetFilterComponent };
export var facetLoad = trigger('facetLoad', [
    state('ready', style({ opacity: 1 })),
    state('loading', style({ opacity: 0 })),
    transition('loading <=> ready', animate(100)),
]);
//# sourceMappingURL=search-facet-filter.component.js.map
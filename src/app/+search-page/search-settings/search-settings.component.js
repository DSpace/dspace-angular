import * as tslib_1 from "tslib";
import { Component, Inject, Input } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';
var SearchSettingsComponent = /** @class */ (function () {
    function SearchSettingsComponent(service, route, router, searchConfigurationService) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.searchConfigurationService = searchConfigurationService;
        /**
         * All sort options that are shown in the settings
         */
        this.searchOptionPossibilities = [new SortOptions('score', SortDirection.DESC), new SortOptions('dc.title', SortDirection.ASC), new SortOptions('dc.title', SortDirection.DESC)];
    }
    /**
     * Initialize paginated search options
     */
    SearchSettingsComponent.prototype.ngOnInit = function () {
        this.searchOptions$ = this.searchConfigurationService.paginatedSearchOptions;
    };
    /**
     * Method to change the current page size (results per page)
     * @param {Event} event Change event containing the new page size value
     */
    SearchSettingsComponent.prototype.reloadRPP = function (event) {
        var value = event.target.value;
        var navigationExtras = {
            queryParams: {
                pageSize: value,
                page: 1
            },
            queryParamsHandling: 'merge'
        };
        this.router.navigate(this.getSearchLinkParts(), navigationExtras);
    };
    /**
     * Method to change the current sort field and direction
     * @param {Event} event Change event containing the sort direction and sort field
     */
    SearchSettingsComponent.prototype.reloadOrder = function (event) {
        var values = event.target.value.split(',');
        var navigationExtras = {
            queryParams: {
                sortDirection: values[1],
                sortField: values[0],
                page: 1
            },
            queryParamsHandling: 'merge'
        };
        this.router.navigate(this.getSearchLinkParts(), navigationExtras);
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchSettingsComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.service.getSearchLink();
    };
    /**
     * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
     */
    SearchSettingsComponent.prototype.getSearchLinkParts = function () {
        if (this.service) {
            return [];
        }
        return this.getSearchLink().split('/');
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSettingsComponent.prototype, "inPlaceSearch", void 0);
    SearchSettingsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-settings',
            styleUrls: ['./search-settings.component.scss'],
            templateUrl: './search-settings.component.html'
        })
        /**
         * This component represents the part of the search sidebar that contains the general search settings.
         */
        ,
        tslib_1.__param(3, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            ActivatedRoute,
            Router,
            SearchConfigurationService])
    ], SearchSettingsComponent);
    return SearchSettingsComponent;
}());
export { SearchSettingsComponent };
//# sourceMappingURL=search-settings.component.js.map
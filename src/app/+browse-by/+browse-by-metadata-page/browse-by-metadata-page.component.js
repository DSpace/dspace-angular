import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { take } from 'rxjs/operators';
import { StartsWithType } from '../../shared/starts-with/starts-with-decorator';
var BrowseByMetadataPageComponent = /** @class */ (function () {
    function BrowseByMetadataPageComponent(route, browseService, dsoService, router) {
        this.route = route;
        this.browseService = browseService;
        this.dsoService = dsoService;
        this.router = router;
        /**
         * The pagination config used to display the values
         */
        this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
            id: 'browse-by-metadata-pagination',
            currentPage: 1,
            pageSize: 20
        });
        /**
         * The sorting config used to sort the values (defaults to Ascending)
         */
        this.sortConfig = new SortOptions('default', SortDirection.ASC);
        /**
         * List of subscriptions
         */
        this.subs = [];
        /**
         * The default metadata definition to resort to when none is provided
         */
        this.defaultMetadata = 'author';
        /**
         * The current metadata definition
         */
        this.metadata = this.defaultMetadata;
        /**
         * The type of StartsWith options to render
         * Defaults to text
         */
        this.startsWithType = StartsWithType.text;
        /**
         * The value we're browing items for
         * - When the value is not empty, we're browsing items
         * - When the value is empty, we're browsing browse-entries (values for the given metadata definition)
         */
        this.value = '';
    }
    BrowseByMetadataPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
        this.subs.push(observableCombineLatest(this.route.params, this.route.queryParams, function (params, queryParams) {
            return Object.assign({}, params, queryParams);
        })
            .subscribe(function (params) {
            _this.metadata = params.metadata || _this.defaultMetadata;
            _this.value = +params.value || params.value || '';
            _this.startsWith = +params.startsWith || params.startsWith;
            var searchOptions = browseParamsToOptions(params, _this.paginationConfig, _this.sortConfig, _this.metadata);
            if (isNotEmpty(_this.value)) {
                _this.updatePageWithItems(searchOptions, _this.value);
            }
            else {
                _this.updatePage(searchOptions);
            }
            _this.updateParent(params.scope);
        }));
        this.updateStartsWithTextOptions();
    };
    /**
     * Update the StartsWith options with text values
     * It adds the value "0-9" as well as all letters from A to Z
     */
    BrowseByMetadataPageComponent.prototype.updateStartsWithTextOptions = function () {
        this.startsWithOptions = ['0-9'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    };
    /**
     * Updates the current page with searchOptions
     * @param searchOptions   Options to narrow down your search:
     *                        { metadata: string
     *                          pagination: PaginationComponentOptions,
     *                          sort: SortOptions,
     *                          scope: string }
     */
    BrowseByMetadataPageComponent.prototype.updatePage = function (searchOptions) {
        this.browseEntries$ = this.browseService.getBrowseEntriesFor(searchOptions);
        this.items$ = undefined;
    };
    /**
     * Updates the current page with searchOptions and display items linked to the given value
     * @param searchOptions   Options to narrow down your search:
     *                        { metadata: string
     *                          pagination: PaginationComponentOptions,
     *                          sort: SortOptions,
     *                          scope: string }
     * @param value          The value of the browse-entry to display items for
     */
    BrowseByMetadataPageComponent.prototype.updatePageWithItems = function (searchOptions, value) {
        this.items$ = this.browseService.getBrowseItemsFor(value, searchOptions);
    };
    /**
     * Update the parent Community or Collection using their scope
     * @param scope   The UUID of the Community or Collection to fetch
     */
    BrowseByMetadataPageComponent.prototype.updateParent = function (scope) {
        if (hasValue(scope)) {
            this.parent$ = this.dsoService.findById(scope).pipe(getSucceededRemoteData());
        }
    };
    /**
     * Navigate to the previous page
     */
    BrowseByMetadataPageComponent.prototype.goPrev = function () {
        var _this = this;
        if (this.items$) {
            this.items$.pipe(take(1)).subscribe(function (items) {
                _this.items$ = _this.browseService.getPrevBrowseItems(items);
            });
        }
        else if (this.browseEntries$) {
            this.browseEntries$.pipe(take(1)).subscribe(function (entries) {
                _this.browseEntries$ = _this.browseService.getPrevBrowseEntries(entries);
            });
        }
    };
    /**
     * Navigate to the next page
     */
    BrowseByMetadataPageComponent.prototype.goNext = function () {
        var _this = this;
        if (this.items$) {
            this.items$.pipe(take(1)).subscribe(function (items) {
                _this.items$ = _this.browseService.getNextBrowseItems(items);
            });
        }
        else if (this.browseEntries$) {
            this.browseEntries$.pipe(take(1)).subscribe(function (entries) {
                _this.browseEntries$ = _this.browseService.getNextBrowseEntries(entries);
            });
        }
    };
    /**
     * Change the page size
     * @param size
     */
    BrowseByMetadataPageComponent.prototype.pageSizeChange = function (size) {
        this.router.navigate([], {
            queryParams: Object.assign({ pageSize: size }),
            queryParamsHandling: 'merge'
        });
    };
    /**
     * Change the sorting direction
     * @param direction
     */
    BrowseByMetadataPageComponent.prototype.sortDirectionChange = function (direction) {
        this.router.navigate([], {
            queryParams: Object.assign({ sortDirection: direction }),
            queryParamsHandling: 'merge'
        });
    };
    BrowseByMetadataPageComponent.prototype.ngOnDestroy = function () {
        this.subs.filter(function (sub) { return hasValue(sub); }).forEach(function (sub) { return sub.unsubscribe(); });
    };
    BrowseByMetadataPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-browse-by-metadata-page',
            styleUrls: ['./browse-by-metadata-page.component.scss'],
            templateUrl: './browse-by-metadata-page.component.html'
        })
        /**
         * Component for browsing (items) by metadata definition
         * A metadata definition is a short term used to describe one or multiple metadata fields.
         * An example would be 'author' for 'dc.contributor.*'
         */
        ,
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            BrowseService,
            DSpaceObjectDataService,
            Router])
    ], BrowseByMetadataPageComponent);
    return BrowseByMetadataPageComponent;
}());
export { BrowseByMetadataPageComponent };
/**
 * Function to transform query and url parameters into searchOptions used to fetch browse entries or items
 * @param params            URL and query parameters
 * @param paginationConfig  Pagination configuration
 * @param sortConfig        Sorting configuration
 * @param metadata          Optional metadata definition to fetch browse entries/items for
 */
export function browseParamsToOptions(params, paginationConfig, sortConfig, metadata) {
    return new BrowseEntrySearchOptions(metadata, Object.assign({}, paginationConfig, {
        currentPage: +params.page || paginationConfig.currentPage,
        pageSize: +params.pageSize || paginationConfig.pageSize
    }), Object.assign({}, sortConfig, {
        direction: params.sortDirection || sortConfig.direction,
        field: params.sortField || sortConfig.field
    }), +params.startsWith || params.startsWith, params.scope);
}
//# sourceMappingURL=browse-by-metadata-page.component.js.map
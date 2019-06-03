import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';
import { isEqual, isObject, transform } from 'lodash';
import { HostWindowService } from '../host-window.service';
import { PaginationComponentOptions } from './pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { hasValue, isNotEmpty } from '../empty.util';
import { difference } from '../object.util';
/**
 * The default pagination controls component.
 */
var PaginationComponent = /** @class */ (function () {
    /**
     * @param route
     *    Route is a singleton service provided by Angular.
     * @param router
     *    Router is a singleton service provided by Angular.
     */
    function PaginationComponent(cdRef, route, router, hostWindowService) {
        this.cdRef = cdRef;
        this.route = route;
        this.router = router;
        this.hostWindowService = hostWindowService;
        /**
         * Page state of a Remote paginated objects.
         */
        this.pageInfoState = undefined;
        /**
         * An event fired when the page is changed.
         * Event's payload equals to the newly selected page.
         */
        this.pageChange = new EventEmitter();
        /**
         * An event fired when the page wsize is changed.
         * Event's payload equals to the newly selected page size.
         */
        this.pageSizeChange = new EventEmitter();
        /**
         * An event fired when the sort direction is changed.
         * Event's payload equals to the newly selected sort direction.
         */
        this.sortDirectionChange = new EventEmitter();
        /**
         * An event fired when the sort field is changed.
         * Event's payload equals to the newly selected sort field.
         */
        this.sortFieldChange = new EventEmitter();
        /**
         * An event fired when the pagination is changed.
         * Event's payload equals to the newly selected sort field.
         */
        this.paginationChange = new EventEmitter();
        /**
         * Option for hiding the pagination detail
         */
        this.hidePaginationDetail = false;
        /**
         * Option for hiding the gear
         */
        this.hideGear = false;
        /**
         * Option for hiding the pager when there is less than 2 pages
         */
        this.hidePagerWhenSinglePage = true;
        /**
         * Current page in the state of a Remote paginated objects.
         */
        this.currentPageState = undefined;
        /**
         * Declare SortDirection enumeration to use it in the template
         */
        this.sortDirections = SortDirection;
        /**
         * Direction in which to sort: ascending or descending
         */
        this.sortDirection = SortDirection.ASC;
        /**
         * Name of the field that's used to sort by
         */
        this.sortField = 'id';
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Method provided by Angular. Invoked after the constructor.
     */
    PaginationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subs.push(this.hostWindowService.isXs()
            .subscribe(function (status) {
            _this.isXs = status;
            _this.cdRef.markForCheck();
        }));
        this.checkConfig(this.paginationOptions);
        this.initializeConfig();
        // Listen to changes
        this.subs.push(this.route.queryParams
            .subscribe(function (queryParams) {
            if (_this.isEmptyPaginationParams(queryParams)) {
                _this.initializeConfig(queryParams);
            }
            else {
                _this.currentQueryParams = queryParams;
                var fixedProperties = _this.validateParams(queryParams);
                if (isNotEmpty(fixedProperties)) {
                    _this.fixRoute(fixedProperties);
                }
                else {
                    _this.setFields();
                }
            }
        }));
    };
    PaginationComponent.prototype.fixRoute = function (fixedProperties) {
        this.updateRoute(fixedProperties);
    };
    /**
     * Method provided by Angular. Invoked when the instance is destroyed.
     */
    PaginationComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
    };
    /**
     * Initializes all default variables
     */
    PaginationComponent.prototype.initializeConfig = function (queryParams) {
        if (queryParams === void 0) { queryParams = {}; }
        // Set initial values
        this.id = this.paginationOptions.id || null;
        this.pageSizeOptions = this.paginationOptions.pageSizeOptions;
        this.currentPage = this.paginationOptions.currentPage;
        this.pageSize = this.paginationOptions.pageSize;
        if (this.sortOptions) {
            this.sortDirection = this.sortOptions.direction;
            this.sortField = this.sortOptions.field;
        }
        this.currentQueryParams = Object.assign({}, queryParams, {
            pageId: this.id,
            page: this.currentPage,
            pageSize: this.pageSize,
            sortDirection: this.sortDirection,
            sortField: this.sortField
        });
    };
    /**
     * Method to change the route to the given page
     *
     * @param page
     *    The page being navigated to.
     */
    PaginationComponent.prototype.doPageChange = function (page) {
        this.updateRoute({ page: page.toString() });
    };
    /**
     * Method to change the route to the given page size
     *
     * @param pageSize
     *    The page size being navigated to.
     */
    PaginationComponent.prototype.doPageSizeChange = function (pageSize) {
        this.updateRoute({ page: 1, pageSize: pageSize });
    };
    /**
     * Method to change the route to the given sort direction
     *
     * @param sortDirection
     *    The sort direction being navigated to.
     */
    PaginationComponent.prototype.doSortDirectionChange = function (sortDirection) {
        this.updateRoute({ page: 1, sortDirection: sortDirection });
    };
    /**
     * Method to change the route to the given sort field
     *
     * @param sortField
     *    The sort field being navigated to.
     */
    PaginationComponent.prototype.doSortFieldChange = function (field) {
        this.updateRoute({ page: 1, sortField: field });
    };
    /**
     * Method to set the current page and trigger page change events
     *
     * @param page
     *    The new page value
     */
    PaginationComponent.prototype.setPage = function (page) {
        this.currentPage = page;
        this.pageChange.emit(page);
        this.emitPaginationChange();
    };
    /**
     * Method to set the current page size and trigger page size change events
     *
     * @param pageSize
     *    The new page size value.
     */
    PaginationComponent.prototype.setPageSize = function (pageSize) {
        this.pageSize = pageSize;
        this.pageSizeChange.emit(pageSize);
        this.emitPaginationChange();
    };
    /**
     * Method to set the current sort direction and trigger sort direction change events
     *
     * @param sortDirection
     *    The new sort directionvalue.
     */
    PaginationComponent.prototype.setSortDirection = function (sortDirection) {
        this.sortDirection = sortDirection;
        this.sortDirectionChange.emit(sortDirection);
        this.emitPaginationChange();
    };
    /**
     * Method to set the current sort field and trigger sort field change events
     *
     * @param sortField
     *    The new sort field.
     */
    PaginationComponent.prototype.setSortField = function (field) {
        this.sortField = field;
        this.sortFieldChange.emit(field);
        this.emitPaginationChange();
    };
    /**
     * Method to emit a general pagination change event
     */
    PaginationComponent.prototype.emitPaginationChange = function () {
        this.paginationChange.emit({
            pageId: this.id,
            page: this.currentPage,
            pageSize: this.pageSize,
            sortDirection: this.sortDirection,
            sortField: this.sortField
        });
    };
    /**
     * Method to update the route parameters
     */
    PaginationComponent.prototype.updateRoute = function (params) {
        if (isNotEmpty(difference(params, this.currentQueryParams))) {
            this.router.navigate([], {
                queryParams: Object.assign({}, this.currentQueryParams, params),
                queryParamsHandling: 'merge'
            });
        }
    };
    PaginationComponent.prototype.difference = function (object, base) {
        var changes = function (o, b) {
            return transform(o, function (result, value, key) {
                if (!isEqual(value, b[key]) && isNotEmpty(value)) {
                    result[key] = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
                }
            });
        };
        return changes(object, base);
    };
    /**
     * Method to get pagination details of the current viewed page.
     */
    PaginationComponent.prototype.getShowingDetails = function (collectionSize) {
        var showingDetails = { range: null + ' - ' + null, total: null };
        if (collectionSize) {
            var firstItem = void 0;
            var lastItem = void 0;
            var pageMax = this.pageSize * this.currentPage;
            firstItem = this.pageSize * (this.currentPage - 1) + 1;
            if (collectionSize > pageMax) {
                lastItem = pageMax;
            }
            else {
                lastItem = collectionSize;
            }
            showingDetails = { range: firstItem + ' - ' + lastItem, total: collectionSize };
        }
        return showingDetails;
    };
    /**
     * Method to validate query params
     *
     * @param page
     *    The page number to validate
     * @param pageSize
     *    The page size to validate
     * @returns valid parameters if initial parameters were invalid
     */
    PaginationComponent.prototype.validateParams = function (params) {
        var validPage = this.validatePage(params.page);
        var filteredSize = this.validatePageSize(params.pageSize);
        var fixedFields = {};
        if (+params.page !== validPage) {
            fixedFields.page = validPage.toString();
        }
        if (+params.pageSize !== filteredSize) {
            fixedFields.pageSize = filteredSize.toString();
        }
        return fixedFields;
    };
    /**
     * Method to update all pagination variables to the current query parameters
     */
    PaginationComponent.prototype.setFields = function () {
        // (+) converts string to a number
        var page = this.currentQueryParams.page;
        if (this.currentPage !== +page) {
            this.setPage(+page);
        }
        var pageSize = this.currentQueryParams.pageSize;
        if (this.pageSize !== +pageSize) {
            this.setPageSize(+pageSize);
        }
        var sortDirection = this.currentQueryParams.sortDirection;
        if (this.sortDirection !== sortDirection) {
            this.setSortDirection(sortDirection);
        }
        var sortField = this.currentQueryParams.sortField;
        if (this.sortField !== sortField) {
            this.setSortField(sortField);
        }
        this.cdRef.detectChanges();
    };
    /**
     * Method to validate the current page value
     *
     * @param page
     *    The page number to validate
     * @returns returns valid page value
     */
    PaginationComponent.prototype.validatePage = function (page) {
        var result = this.currentPage;
        if (isNumeric(page)) {
            result = +page;
        }
        return result;
    };
    /**
     * Method to validate the current page size value
     *
     * @param page size
     *    The page size to validate
     * @returns returns valid page size value
     */
    PaginationComponent.prototype.validatePageSize = function (pageSize) {
        var filteredPageSize = this.pageSizeOptions.find(function (x) { return x === +pageSize; });
        var result = this.pageSize;
        if (filteredPageSize) {
            result = +pageSize;
        }
        return result;
    };
    /**
     * Method to ensure options passed contains the required properties.
     *
     * @param paginateOptions
     *    The paginate options object.
     */
    PaginationComponent.prototype.checkConfig = function (paginateOptions) {
        var required = ['id', 'currentPage', 'pageSize', 'pageSizeOptions'];
        var missing = required.filter(function (prop) {
            return !(prop in paginateOptions);
        });
        if (0 < missing.length) {
            throw new Error('Paginate: Argument is missing the following required properties: ' + missing.join(', '));
        }
    };
    /**
     * Method to check if none of the query params necessary for pagination are filled out.
     *
     * @param paginateOptions
     *    The paginate options object.
     */
    PaginationComponent.prototype.isEmptyPaginationParams = function (paginateOptions) {
        var properties = ['id', 'currentPage', 'pageSize', 'pageSizeOptions'];
        var missing = properties.filter(function (prop) {
            return !(prop in paginateOptions);
        });
        return properties.length === missing.length;
    };
    Object.defineProperty(PaginationComponent.prototype, "hasMultiplePages", {
        /**
         * Property to check whether the current pagination object has multiple pages
         * @returns true if there are multiple pages, else returns false
         */
        get: function () {
            return this.collectionSize > this.pageSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "shouldShowBottomPager", {
        /**
         * Property to check whether the current pagination should show a bottom pages
         * @returns true if a bottom pages should be shown, else returns false
         */
        get: function () {
            return this.hasMultiplePages || !this.hidePagerWhenSinglePage;
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], PaginationComponent.prototype, "collectionSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], PaginationComponent.prototype, "pageInfoState", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], PaginationComponent.prototype, "paginationOptions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], PaginationComponent.prototype, "sortOptions", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], PaginationComponent.prototype, "pageChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], PaginationComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], PaginationComponent.prototype, "sortDirectionChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], PaginationComponent.prototype, "sortFieldChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], PaginationComponent.prototype, "paginationChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PaginationComponent.prototype, "hidePaginationDetail", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PaginationComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PaginationComponent.prototype, "hidePagerWhenSinglePage", void 0);
    PaginationComponent = tslib_1.__decorate([
        Component({
            exportAs: 'paginationComponent',
            selector: 'ds-pagination',
            styleUrls: ['pagination.component.scss'],
            templateUrl: 'pagination.component.html',
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.Emulated
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            ActivatedRoute,
            Router,
            HostWindowService])
    ], PaginationComponent);
    return PaginationComponent;
}());
export { PaginationComponent };
//# sourceMappingURL=pagination.component.js.map
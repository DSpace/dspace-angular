import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, } from 'rxjs/operators';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { getSucceededRemoteData } from '../core/shared/operators';
import { RouteService } from '../shared/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
export var SEARCH_ROUTE = '/search';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var SearchPageComponent = /** @class */ (function () {
    function SearchPageComponent(service, sidebarService, windowService, searchConfigService, routeService) {
        this.service = service;
        this.sidebarService = sidebarService;
        this.windowService = windowService;
        this.searchConfigService = searchConfigService;
        this.routeService = routeService;
        /**
         * The current search results
         */
        this.resultsRD$ = new BehaviorSubject(null);
        /**
         * True when the search component should show results on the current page
         */
        this.inPlaceSearch = true;
        /**
         * Whether or not the search bar should be visible
         */
        this.searchEnabled = true;
        /**
         * The width of the sidebar (bootstrap columns)
         */
        this.sideBarWidth = 3;
        this.isXsOrSm$ = this.windowService.isXsOrSm();
    }
    /**
     * Listening to changes in the paginated search options
     * If something changes, update the search results
     *
     * Listen to changes in the scope
     * If something changes, update the list of scopes for the dropdown
     */
    SearchPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchOptions$ = this.getSearchOptions();
        this.sub = this.searchOptions$.pipe(switchMap(function (options) { return _this.service.search(options).pipe(getSucceededRemoteData()); }))
            .subscribe(function (results) {
            _this.resultsRD$.next(results);
        });
        this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(switchMap(function (scopeId) { return _this.service.getScopes(scopeId); }));
        if (!isNotEmpty(this.fixedFilter$)) {
            this.fixedFilter$ = this.routeService.getRouteParameterValue('filter');
        }
    };
    /**
     * Get the current paginated search options
     * @returns {Observable<PaginatedSearchOptions>}
     */
    SearchPageComponent.prototype.getSearchOptions = function () {
        return this.searchConfigService.paginatedSearchOptions;
    };
    /**
     * Set the sidebar to a collapsed state
     */
    SearchPageComponent.prototype.closeSidebar = function () {
        this.sidebarService.collapse();
    };
    /**
     * Set the sidebar to an expanded state
     */
    SearchPageComponent.prototype.openSidebar = function () {
        this.sidebarService.expand();
    };
    /**
     * Check if the sidebar is collapsed
     * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
     */
    SearchPageComponent.prototype.isSidebarCollapsed = function () {
        return this.sidebarService.isCollapsed;
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchPageComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.service.getSearchLink();
    };
    /**
     * Unsubscribe from the subscription
     */
    SearchPageComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchPageComponent.prototype, "inPlaceSearch", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchPageComponent.prototype, "searchEnabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchPageComponent.prototype, "sideBarWidth", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], SearchPageComponent.prototype, "fixedFilter$", void 0);
    SearchPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-page',
            styleUrls: ['./search-page.component.scss'],
            templateUrl: './search-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [pushInOut],
            providers: [
                {
                    provide: SEARCH_CONFIG_SERVICE,
                    useClass: SearchConfigurationService
                }
            ]
        })
        /**
         * This component represents the whole search page
         * It renders search results depending on the current search options
         */
        ,
        tslib_1.__param(3, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchSidebarService,
            HostWindowService,
            SearchConfigurationService,
            RouteService])
    ], SearchPageComponent);
    return SearchPageComponent;
}());
export { SearchPageComponent };
//# sourceMappingURL=search-page.component.js.map
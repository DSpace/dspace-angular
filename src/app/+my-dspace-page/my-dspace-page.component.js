import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Inject, InjectionToken, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap, } from 'rxjs/operators';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchService } from '../+search-page/search-service/search.service';
import { SearchSidebarService } from '../+search-page/search-sidebar/search-sidebar.service';
import { hasValue } from '../shared/empty.util';
import { getSucceededRemoteData } from '../core/shared/operators';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { RoleType } from '../core/roles/role-types';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { ViewMode } from '../core/shared/view-mode.model';
import { MyDSpaceRequest } from '../core/data/request.models';
export var MYDSPACE_ROUTE = '/mydspace';
export var SEARCH_CONFIG_SERVICE = new InjectionToken('searchConfigurationService');
/**
 * This component represents the whole mydspace page
 */
var MyDSpacePageComponent = /** @class */ (function () {
    function MyDSpacePageComponent(service, sidebarService, windowService, searchConfigService) {
        this.service = service;
        this.sidebarService = sidebarService;
        this.windowService = windowService;
        this.searchConfigService = searchConfigService;
        /**
         * True when the search component should show results on the current page
         */
        this.inPlaceSearch = true;
        /**
         * The current search results
         */
        this.resultsRD$ = new BehaviorSubject(null);
        /**
         * Variable for enumeration RoleType
         */
        this.roleTypeEnum = RoleType;
        /**
         * List of available view mode
         */
        this.viewModeList = [ViewMode.List, ViewMode.Detail];
        this.isXsOrSm$ = this.windowService.isXsOrSm();
        this.service.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
    }
    /**
     * Initialize available configuration list
     *
     * Listening to changes in the paginated search options
     * If something changes, update the search results
     *
     * Listen to changes in the scope
     * If something changes, update the list of scopes for the dropdown
     */
    MyDSpacePageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.configurationList$ = this.searchConfigService.getAvailableConfigurationOptions();
        this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
        this.sub = this.searchOptions$.pipe(tap(function () { return _this.resultsRD$.next(null); }), switchMap(function (options) { return _this.service.search(options).pipe(getSucceededRemoteData()); }))
            .subscribe(function (results) {
            _this.resultsRD$.next(results);
        });
        this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(switchMap(function (scopeId) { return _this.service.getScopes(scopeId); }));
    };
    /**
     * Set the sidebar to a collapsed state
     */
    MyDSpacePageComponent.prototype.closeSidebar = function () {
        this.sidebarService.collapse();
    };
    /**
     * Set the sidebar to an expanded state
     */
    MyDSpacePageComponent.prototype.openSidebar = function () {
        this.sidebarService.expand();
    };
    /**
     * Check if the sidebar is collapsed
     * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
     */
    MyDSpacePageComponent.prototype.isSidebarCollapsed = function () {
        return this.sidebarService.isCollapsed;
    };
    /**
     * @returns {string} The base path to the search page
     */
    MyDSpacePageComponent.prototype.getSearchLink = function () {
        return this.service.getSearchLink();
    };
    /**
     * Unsubscribe from the subscription
     */
    MyDSpacePageComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MyDSpacePageComponent.prototype, "inPlaceSearch", void 0);
    MyDSpacePageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-my-dspace-page',
            styleUrls: ['./my-dspace-page.component.scss'],
            templateUrl: './my-dspace-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [pushInOut],
            providers: [
                {
                    provide: SEARCH_CONFIG_SERVICE,
                    useClass: MyDSpaceConfigurationService
                }
            ]
        }),
        tslib_1.__param(3, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchSidebarService,
            HostWindowService,
            MyDSpaceConfigurationService])
    ], MyDSpacePageComponent);
    return MyDSpacePageComponent;
}());
export { MyDSpacePageComponent };
//# sourceMappingURL=my-dspace-page.component.js.map
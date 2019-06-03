import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { SearchSidebarCollapseAction, SearchSidebarExpandAction } from './search-sidebar.actions';
import { HostWindowService } from '../../shared/host-window.service';
import { map } from 'rxjs/operators';
var sidebarStateSelector = function (state) { return state.searchSidebar; };
var sidebarCollapsedSelector = createSelector(sidebarStateSelector, function (sidebar) { return sidebar.sidebarCollapsed; });
/**
 * Service that performs all actions that have to do with the search sidebar
 */
var SearchSidebarService = /** @class */ (function () {
    function SearchSidebarService(store, windowService) {
        this.store = store;
        this.windowService = windowService;
        this.isXsOrSm$ = this.windowService.isXsOrSm();
        this.isCollapsedInStore = this.store.pipe(select(sidebarCollapsedSelector));
    }
    Object.defineProperty(SearchSidebarService.prototype, "isCollapsed", {
        /**
         * Checks if the sidebar should currently be collapsed
         * @returns {Observable<boolean>} Emits true if the user's screen size is mobile or when the state in the store is currently collapsed
         */
        get: function () {
            return observableCombineLatest(this.isXsOrSm$, this.isCollapsedInStore).pipe(map(function (_a) {
                var mobile = _a[0], store = _a[1];
                return mobile ? store : true;
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispatches a collapse action to the store
     */
    SearchSidebarService.prototype.collapse = function () {
        this.store.dispatch(new SearchSidebarCollapseAction());
    };
    /**
     * Dispatches an expand action to the store
     */
    SearchSidebarService.prototype.expand = function () {
        this.store.dispatch(new SearchSidebarExpandAction());
    };
    SearchSidebarService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store, HostWindowService])
    ], SearchSidebarService);
    return SearchSidebarService;
}());
export { SearchSidebarService };
//# sourceMappingURL=search-sidebar.service.js.map
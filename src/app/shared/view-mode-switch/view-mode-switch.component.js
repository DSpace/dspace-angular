import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { SearchService } from '../../+search-page/search-service/search.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { isEmpty } from '../empty.util';
/**
 * Component to switch between list and grid views.
 */
var ViewModeSwitchComponent = /** @class */ (function () {
    function ViewModeSwitchComponent(searchService) {
        this.searchService = searchService;
        this.currentMode = ViewMode.List;
        this.viewModeEnum = ViewMode;
    }
    ViewModeSwitchComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (isEmpty(this.viewModeList)) {
            this.viewModeList = [ViewMode.List, ViewMode.Grid];
        }
        this.sub = this.searchService.getViewMode().subscribe(function (viewMode) {
            _this.currentMode = viewMode;
        });
    };
    ViewModeSwitchComponent.prototype.switchViewTo = function (viewMode) {
        this.searchService.setViewMode(viewMode, this.getSearchLinkParts());
    };
    ViewModeSwitchComponent.prototype.ngOnDestroy = function () {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    };
    ViewModeSwitchComponent.prototype.isToShow = function (viewMode) {
        return this.viewModeList && this.viewModeList.includes(viewMode);
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    ViewModeSwitchComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
     */
    ViewModeSwitchComponent.prototype.getSearchLinkParts = function () {
        if (this.searchService) {
            return [];
        }
        return this.getSearchLink().split('/');
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], ViewModeSwitchComponent.prototype, "viewModeList", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ViewModeSwitchComponent.prototype, "inPlaceSearch", void 0);
    ViewModeSwitchComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-view-mode-switch',
            styleUrls: ['./view-mode-switch.component.scss'],
            templateUrl: './view-mode-switch.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [SearchService])
    ], ViewModeSwitchComponent);
    return ViewModeSwitchComponent;
}());
export { ViewModeSwitchComponent };
//# sourceMappingURL=view-mode-switch.component.js.map
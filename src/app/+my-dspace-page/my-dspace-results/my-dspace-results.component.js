import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SearchOptions } from '../../+search-page/search-options.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { isEmpty } from '../../shared/empty.util';
/**
 * Component that represents all results for mydspace page
 */
var MyDSpaceResultsComponent = /** @class */ (function () {
    function MyDSpaceResultsComponent() {
        /**
         * A boolean representing if search results entry are separated by a line
         */
        this.hasBorder = true;
    }
    /**
     * Check if mydspace search results are loading
     */
    MyDSpaceResultsComponent.prototype.isLoading = function () {
        return !this.searchResults || isEmpty(this.searchResults) || this.searchResults.isLoading;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData)
    ], MyDSpaceResultsComponent.prototype, "searchResults", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchOptions)
    ], MyDSpaceResultsComponent.prototype, "searchConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MyDSpaceResultsComponent.prototype, "viewMode", void 0);
    MyDSpaceResultsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-my-dspace-results',
            templateUrl: './my-dspace-results.component.html',
            animations: [
                fadeIn,
                fadeInOut
            ]
        })
    ], MyDSpaceResultsComponent);
    return MyDSpaceResultsComponent;
}());
export { MyDSpaceResultsComponent };
//# sourceMappingURL=my-dspace-results.component.js.map
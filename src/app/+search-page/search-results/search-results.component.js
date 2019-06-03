import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SetViewMode } from '../../shared/view-mode';
import { SearchOptions } from '../search-options.model';
import { isNotEmpty } from '../../shared/empty.util';
import { SortOptions } from '../../core/cache/models/sort-options.model';
var SearchResultsComponent = /** @class */ (function () {
    function SearchResultsComponent() {
        /**
         * Whether or not to hide the header of the results
         * Defaults to a visible header
         */
        this.disableHeader = false;
    }
    /**
     * Get the i18n key for the title depending on the fixed filter
     * Defaults to 'search.results.head' if there's no fixed filter found
     * @returns {string}
     */
    SearchResultsComponent.prototype.getTitleKey = function () {
        if (isNotEmpty(this.fixedFilter)) {
            return 'search.' + this.fixedFilter + '.results.head';
        }
        else {
            return 'search.results.head';
        }
    };
    /**
     * Method to change the given string by surrounding it by quotes if not already present.
     */
    SearchResultsComponent.prototype.surroundStringWithQuotes = function (input) {
        var result = input;
        if (isNotEmpty(result) && !(result.startsWith('\"') && result.endsWith('\"'))) {
            result = "\"" + result + "\"";
        }
        return result;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData)
    ], SearchResultsComponent.prototype, "searchResults", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchOptions)
    ], SearchResultsComponent.prototype, "searchConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], SearchResultsComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SearchResultsComponent.prototype, "viewMode", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SearchResultsComponent.prototype, "fixedFilter", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchResultsComponent.prototype, "disableHeader", void 0);
    SearchResultsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-results',
            templateUrl: './search-results.component.html',
            animations: [
                fadeIn,
                fadeInOut
            ]
        })
        /**
         * Component that represents all results from a search
         */
    ], SearchResultsComponent);
    return SearchResultsComponent;
}());
export { SearchResultsComponent };
//# sourceMappingURL=search-results.component.js.map
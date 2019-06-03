import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var FilteredSearchPageGuard = /** @class */ (function () {
    /**
     * Assemble the correct i18n key for the filtered search page's title depending on the current route's filter parameter
     * and title data.
     * The format of the key will be "{title}{filter}.title" with:
     * - title: The prefix of the key stored in route.data
     * - filter: The current filter stored in route.params
     */
    function FilteredSearchPageGuard() {
    }
    FilteredSearchPageGuard.prototype.canActivate = function (route, state) {
        var filter = route.params.filter;
        var newTitle = route.data.title + filter + '.title';
        route.data = { title: newTitle };
        return true;
    };
    FilteredSearchPageGuard = tslib_1.__decorate([
        Injectable()
        /**
         * Assemble the correct i18n key for the filtered search page's title depending on the current route's filter parameter
         * and title data.
         * The format of the key will be "{title}{filter}.title" with:
         * - title: The prefix of the key stored in route.data
         * - filter: The current filter stored in route.params
         */
    ], FilteredSearchPageGuard);
    return FilteredSearchPageGuard;
}());
export { FilteredSearchPageGuard };
//# sourceMappingURL=filtered-search-page.guard.js.map
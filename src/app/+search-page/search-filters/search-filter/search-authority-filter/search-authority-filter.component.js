import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';
var SearchAuthorityFilterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchAuthorityFilterComponent, _super);
    function SearchAuthorityFilterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
     * Retrieve facet value from search link
     */
    SearchAuthorityFilterComponent.prototype.getFacetValue = function (facet) {
        var search = facet.search;
        var hashes = search.slice(search.indexOf('?') + 1).split('&');
        var params = {};
        hashes.map(function (hash) {
            var _a = hash.split('='), key = _a[0], val = _a[1];
            params[key] = decodeURIComponent(val);
        });
        return params[this.filterConfig.paramName];
    };
    SearchAuthorityFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-authority-filter',
            styleUrls: ['./search-authority-filter.component.scss'],
            templateUrl: './search-authority-filter.component.html',
            animations: [facetLoad]
        })
        /**
         * Component that represents an authority facet for a specific filter configuration
         */
        ,
        renderFacetFor(FilterType.authority)
    ], SearchAuthorityFilterComponent);
    return SearchAuthorityFilterComponent;
}(SearchFacetFilterComponent));
export { SearchAuthorityFilterComponent };
//# sourceMappingURL=search-authority-filter.component.js.map
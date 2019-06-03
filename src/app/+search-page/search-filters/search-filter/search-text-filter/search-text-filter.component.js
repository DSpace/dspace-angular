import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var SearchTextFilterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchTextFilterComponent, _super);
    function SearchTextFilterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchTextFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-text-filter',
            styleUrls: ['./search-text-filter.component.scss'],
            templateUrl: './search-text-filter.component.html',
            animations: [facetLoad]
        })
        /**
         * Component that represents a text facet for a specific filter configuration
         */
        ,
        renderFacetFor(FilterType.text)
    ], SearchTextFilterComponent);
    return SearchTextFilterComponent;
}(SearchFacetFilterComponent));
export { SearchTextFilterComponent };
//# sourceMappingURL=search-text-filter.component.js.map
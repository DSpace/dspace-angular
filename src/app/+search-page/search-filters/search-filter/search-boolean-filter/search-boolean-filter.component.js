import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
var SearchBooleanFilterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchBooleanFilterComponent, _super);
    function SearchBooleanFilterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchBooleanFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-boolean-filter',
            styleUrls: ['./search-boolean-filter.component.scss'],
            templateUrl: './search-boolean-filter.component.html',
            animations: [facetLoad]
        })
        /**
         * Component that represents a boolean facet for a specific filter configuration
         */
        ,
        renderFacetFor(FilterType.boolean)
    ], SearchBooleanFilterComponent);
    return SearchBooleanFilterComponent;
}(SearchFacetFilterComponent));
export { SearchBooleanFilterComponent };
//# sourceMappingURL=search-boolean-filter.component.js.map
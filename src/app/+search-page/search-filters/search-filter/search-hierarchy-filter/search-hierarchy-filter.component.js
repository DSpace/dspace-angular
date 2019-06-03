import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
var SearchHierarchyFilterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchHierarchyFilterComponent, _super);
    function SearchHierarchyFilterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchHierarchyFilterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-hierarchy-filter',
            styleUrls: ['./search-hierarchy-filter.component.scss'],
            templateUrl: './search-hierarchy-filter.component.html',
            animations: [facetLoad]
        })
        /**
         * Component that represents a hierarchy facet for a specific filter configuration
         */
        ,
        renderFacetFor(FilterType.hierarchy)
    ], SearchHierarchyFilterComponent);
    return SearchHierarchyFilterComponent;
}(SearchFacetFilterComponent));
export { SearchHierarchyFilterComponent };
//# sourceMappingURL=search-hierarchy-filter.component.js.map
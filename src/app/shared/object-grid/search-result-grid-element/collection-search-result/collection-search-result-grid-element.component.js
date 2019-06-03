import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { SetViewMode } from '../../../view-mode';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
var CollectionSearchResultGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionSearchResultGridElementComponent, _super);
    function CollectionSearchResultGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionSearchResultGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-search-result-grid-element',
            styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
            templateUrl: 'collection-search-result-grid-element.component.html'
        }),
        renderElementsFor(CollectionSearchResult, SetViewMode.Grid)
    ], CollectionSearchResultGridElementComponent);
    return CollectionSearchResultGridElementComponent;
}(SearchResultGridElementComponent));
export { CollectionSearchResultGridElementComponent };
//# sourceMappingURL=collection-search-result-grid-element.component.js.map
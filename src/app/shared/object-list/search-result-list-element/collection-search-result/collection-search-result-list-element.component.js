import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { SetViewMode } from '../../../view-mode';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
var CollectionSearchResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionSearchResultListElementComponent, _super);
    function CollectionSearchResultListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionSearchResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-search-result-list-element',
            styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
            templateUrl: 'collection-search-result-list-element.component.html'
        }),
        renderElementsFor(CollectionSearchResult, SetViewMode.List)
    ], CollectionSearchResultListElementComponent);
    return CollectionSearchResultListElementComponent;
}(SearchResultListElementComponent));
export { CollectionSearchResultListElementComponent };
//# sourceMappingURL=collection-search-result-list-element.component.js.map
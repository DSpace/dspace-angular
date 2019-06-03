import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SetViewMode } from '../../../view-mode';
import { focusShadow } from '../../../../shared/animations/focus';
var ItemSearchResultGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemSearchResultGridElementComponent, _super);
    function ItemSearchResultGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemSearchResultGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-search-result-grid-element',
            styleUrls: ['../search-result-grid-element.component.scss', 'item-search-result-grid-element.component.scss'],
            templateUrl: 'item-search-result-grid-element.component.html',
            animations: [focusShadow],
        }),
        renderElementsFor(ItemSearchResult, SetViewMode.Grid)
    ], ItemSearchResultGridElementComponent);
    return ItemSearchResultGridElementComponent;
}(SearchResultGridElementComponent));
export { ItemSearchResultGridElementComponent };
//# sourceMappingURL=item-search-result-grid-element.component.js.map
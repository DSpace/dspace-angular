import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { focusBackground } from '../../../animations/focus';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SetViewMode } from '../../../view-mode';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { ItemViewMode } from '../../../items/item-type-decorator';
var ItemSearchResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemSearchResultListElementComponent, _super);
    function ItemSearchResultListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.viewMode = ItemViewMode.Element;
        return _this;
    }
    ItemSearchResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-search-result-list-element',
            styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
            templateUrl: 'item-search-result-list-element.component.html',
            animations: [focusBackground],
        }),
        renderElementsFor(ItemSearchResult, SetViewMode.List)
    ], ItemSearchResultListElementComponent);
    return ItemSearchResultListElementComponent;
}(SearchResultListElementComponent));
export { ItemSearchResultListElementComponent };
//# sourceMappingURL=item-search-result-list-element.component.js.map
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DEFAULT_ITEM_TYPE, ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var PublicationListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PublicationListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Publication
     */
    function PublicationListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PublicationListElementComponent = tslib_1.__decorate([
        rendersItemType('Publication', ItemViewMode.Element),
        rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Element),
        Component({
            selector: 'ds-publication-list-element',
            styleUrls: ['./publication-list-element.component.scss'],
            templateUrl: './publication-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Publication
         */
    ], PublicationListElementComponent);
    return PublicationListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { PublicationListElementComponent };
//# sourceMappingURL=publication-list-element.component.js.map
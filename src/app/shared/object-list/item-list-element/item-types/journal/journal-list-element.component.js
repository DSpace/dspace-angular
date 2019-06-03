import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var JournalListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Journal
     */
    function JournalListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JournalListElementComponent = tslib_1.__decorate([
        rendersItemType('Journal', ItemViewMode.Element),
        Component({
            selector: 'ds-journal-list-element',
            styleUrls: ['./journal-list-element.component.scss'],
            templateUrl: './journal-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Journal
         */
    ], JournalListElementComponent);
    return JournalListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { JournalListElementComponent };
//# sourceMappingURL=journal-list-element.component.js.map
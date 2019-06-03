import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var JournalVolumeListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalVolumeListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Journal Volume
     */
    function JournalVolumeListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JournalVolumeListElementComponent = tslib_1.__decorate([
        rendersItemType('JournalVolume', ItemViewMode.Element),
        Component({
            selector: 'ds-journal-volume-list-element',
            styleUrls: ['./journal-volume-list-element.component.scss'],
            templateUrl: './journal-volume-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Journal Volume
         */
    ], JournalVolumeListElementComponent);
    return JournalVolumeListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { JournalVolumeListElementComponent };
//# sourceMappingURL=journal-volume-list-element.component.js.map
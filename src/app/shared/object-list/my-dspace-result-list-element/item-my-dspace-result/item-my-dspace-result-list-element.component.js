import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders item object for the mydspace result in the list view.
 */
var ItemMyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemMyDSpaceResultListElementComponent, _super);
    function ItemMyDSpaceResultListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.ARCHIVED;
        return _this;
    }
    ItemMyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workspaceitem-my-dspace-result-list-element',
            styleUrls: ['../my-dspace-result-list-element.component.scss', './item-my-dspace-result-list-element.component.scss'],
            templateUrl: './item-my-dspace-result-list-element.component.html'
        }),
        renderElementsFor(ItemMyDSpaceResult, SetViewMode.List)
    ], ItemMyDSpaceResultListElementComponent);
    return ItemMyDSpaceResultListElementComponent;
}(MyDSpaceResultListElementComponent));
export { ItemMyDSpaceResultListElementComponent };
//# sourceMappingURL=item-my-dspace-result-list-element.component.js.map
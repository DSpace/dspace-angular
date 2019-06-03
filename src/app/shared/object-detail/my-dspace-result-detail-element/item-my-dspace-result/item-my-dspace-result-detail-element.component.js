import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders item object for the mydspace result in the detail view.
 */
var ItemMyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemMyDSpaceResultDetailElementComponent, _super);
    function ItemMyDSpaceResultDetailElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.ARCHIVED;
        return _this;
    }
    ItemMyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workspaceitem-my-dspace-result-detail-element',
            styleUrls: ['../my-dspace-result-detail-element.component.scss', './item-my-dspace-result-detail-element.component.scss'],
            templateUrl: './item-my-dspace-result-detail-element.component.html'
        }),
        renderElementsFor(ItemMyDSpaceResult, SetViewMode.Detail)
    ], ItemMyDSpaceResultDetailElementComponent);
    return ItemMyDSpaceResultDetailElementComponent;
}(MyDSpaceResultDetailElementComponent));
export { ItemMyDSpaceResultDetailElementComponent };
//# sourceMappingURL=item-my-dspace-result-detail-element.component.js.map
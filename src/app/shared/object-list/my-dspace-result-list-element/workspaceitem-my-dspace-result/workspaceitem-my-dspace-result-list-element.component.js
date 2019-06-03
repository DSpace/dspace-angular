import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { isNotUndefined } from '../../../empty.util';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders workspaceitem object for the mydspace result in the list view.
 */
var WorkspaceitemMyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkspaceitemMyDSpaceResultListElementComponent, _super);
    function WorkspaceitemMyDSpaceResultListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.WORKSPACE;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    WorkspaceitemMyDSpaceResultListElementComponent.prototype.ngOnInit = function () {
        this.initItem(this.dso.item);
    };
    /**
     * Retrieve item from result object
     */
    WorkspaceitemMyDSpaceResultListElementComponent.prototype.initItem = function (item$) {
        var _this = this;
        item$.pipe(find(function (rd) { return rd.hasSucceeded && isNotUndefined(rd.payload); })).subscribe(function (rd) {
            _this.item = rd.payload;
        });
    };
    WorkspaceitemMyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workspaceitem-my-dspace-result-list-element',
            styleUrls: ['../my-dspace-result-list-element.component.scss', './workspaceitem-my-dspace-result-list-element.component.scss'],
            templateUrl: './workspaceitem-my-dspace-result-list-element.component.html',
        }),
        renderElementsFor(WorkspaceitemMyDSpaceResult, SetViewMode.List)
    ], WorkspaceitemMyDSpaceResultListElementComponent);
    return WorkspaceitemMyDSpaceResultListElementComponent;
}(MyDSpaceResultListElementComponent));
export { WorkspaceitemMyDSpaceResultListElementComponent };
//# sourceMappingURL=workspaceitem-my-dspace-result-list-element.component.js.map
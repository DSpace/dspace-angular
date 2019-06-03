import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { isNotUndefined } from '../../../empty.util';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders workspaceitem object for the mydspace result in the detail view.
 */
var WorkspaceitemMyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkspaceitemMyDSpaceResultDetailElementComponent, _super);
    function WorkspaceitemMyDSpaceResultDetailElementComponent(listable) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.WORKSPACE;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    WorkspaceitemMyDSpaceResultDetailElementComponent.prototype.ngOnInit = function () {
        this.initItem(this.dso.item);
    };
    /**
     * Retrieve item from result object
     */
    WorkspaceitemMyDSpaceResultDetailElementComponent.prototype.initItem = function (item$) {
        var _this = this;
        item$.pipe(find(function (rd) { return rd.hasSucceeded && isNotUndefined(rd.payload); })).subscribe(function (rd) {
            _this.item = rd.payload;
        });
    };
    WorkspaceitemMyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workspaceitem-my-dspace-result-detail-element',
            styleUrls: ['../my-dspace-result-detail-element.component.scss', './workspaceitem-my-dspace-result-detail-element.component.scss'],
            templateUrl: './workspaceitem-my-dspace-result-detail-element.component.html',
        }),
        renderElementsFor(WorkspaceitemMyDSpaceResult, SetViewMode.Detail),
        renderElementsFor(Workspaceitem, SetViewMode.Detail),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], WorkspaceitemMyDSpaceResultDetailElementComponent);
    return WorkspaceitemMyDSpaceResultDetailElementComponent;
}(MyDSpaceResultDetailElementComponent));
export { WorkspaceitemMyDSpaceResultDetailElementComponent };
//# sourceMappingURL=workspaceitem-my-dspace-result-detail-element.component.js.map
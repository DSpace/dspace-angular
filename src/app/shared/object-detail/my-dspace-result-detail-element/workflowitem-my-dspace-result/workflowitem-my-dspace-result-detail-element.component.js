import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { find } from 'rxjs/operators';
import { isNotUndefined } from '../../../empty.util';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders workflowitem object for the mydspace result in the detail view.
 */
var WorkflowitemMyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkflowitemMyDSpaceResultDetailElementComponent, _super);
    function WorkflowitemMyDSpaceResultDetailElementComponent(listable) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.WORKFLOW;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    WorkflowitemMyDSpaceResultDetailElementComponent.prototype.ngOnInit = function () {
        this.initItem(this.dso.item);
    };
    /**
     * Retrieve item from result object
     */
    WorkflowitemMyDSpaceResultDetailElementComponent.prototype.initItem = function (item$) {
        var _this = this;
        item$.pipe(find(function (rd) { return rd.hasSucceeded && isNotUndefined(rd.payload); })).subscribe(function (rd) {
            _this.item = rd.payload;
        });
    };
    WorkflowitemMyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workflowitem-my-dspace-result-detail-element',
            styleUrls: ['../my-dspace-result-detail-element.component.scss'],
            templateUrl: './workflowitem-my-dspace-result-detail-element.component.html',
        }),
        renderElementsFor(WorkflowitemMyDSpaceResult, SetViewMode.Detail),
        renderElementsFor(Workflowitem, SetViewMode.Detail),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], WorkflowitemMyDSpaceResultDetailElementComponent);
    return WorkflowitemMyDSpaceResultDetailElementComponent;
}(MyDSpaceResultDetailElementComponent));
export { WorkflowitemMyDSpaceResultDetailElementComponent };
//# sourceMappingURL=workflowitem-my-dspace-result-detail-element.component.js.map
import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { isNotUndefined } from '../../../empty.util';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders pool task object for the mydspace result in the detail view.
 */
var PoolMyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PoolMyDSpaceResultDetailElementComponent, _super);
    function PoolMyDSpaceResultDetailElementComponent(listable) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        /**
         * A boolean representing if to show submitter information
         */
        _this.showSubmitter = true;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.WAITING_CONTROLLER;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    PoolMyDSpaceResultDetailElementComponent.prototype.ngOnInit = function () {
        this.initWorkflowItem(this.dso.workflowitem);
    };
    /**
     * Retrieve workflowitem from result object
     */
    PoolMyDSpaceResultDetailElementComponent.prototype.initWorkflowItem = function (wfi$) {
        var _this = this;
        wfi$.pipe(find(function (rd) { return (rd.hasSucceeded && isNotUndefined(rd.payload)); })).subscribe(function (rd) {
            _this.workflowitem = rd.payload;
        });
    };
    PoolMyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-pool-my-dspace-result-detail-element',
            styleUrls: ['../my-dspace-result-detail-element.component.scss'],
            templateUrl: './pool-my-dspace-result-detail-element.component.html',
        }),
        renderElementsFor(PoolTaskMyDSpaceResult, SetViewMode.Detail),
        renderElementsFor(PoolTask, SetViewMode.Detail),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], PoolMyDSpaceResultDetailElementComponent);
    return PoolMyDSpaceResultDetailElementComponent;
}(MyDSpaceResultDetailElementComponent));
export { PoolMyDSpaceResultDetailElementComponent };
//# sourceMappingURL=pool-my-dspace-result-detail-lement.component.js.map
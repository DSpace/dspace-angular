import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { isNotUndefined } from '../../../empty.util';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders claimed task object for the mydspace result in the detail view.
 */
var ClaimedMyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ClaimedMyDSpaceResultDetailElementComponent, _super);
    function ClaimedMyDSpaceResultDetailElementComponent(listable) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        /**
         * A boolean representing if to show submitter information
         */
        _this.showSubmitter = true;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.VALIDATION;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    ClaimedMyDSpaceResultDetailElementComponent.prototype.ngOnInit = function () {
        this.initWorkflowItem(this.dso.workflowitem);
    };
    /**
     * Retrieve workflowitem from result object
     */
    ClaimedMyDSpaceResultDetailElementComponent.prototype.initWorkflowItem = function (wfi$) {
        var _this = this;
        wfi$.pipe(find(function (rd) { return (rd.hasSucceeded && isNotUndefined(rd.payload)); })).subscribe(function (rd) {
            _this.workflowitem = rd.payload;
        });
    };
    ClaimedMyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-my-dspace-result-detail-element',
            styleUrls: ['../my-dspace-result-detail-element.component.scss'],
            templateUrl: './claimed-my-dspace-result-detail-element.component.html'
        }),
        renderElementsFor(ClaimedTaskMyDSpaceResult, SetViewMode.Detail),
        renderElementsFor(ClaimedTask, SetViewMode.Detail),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], ClaimedMyDSpaceResultDetailElementComponent);
    return ClaimedMyDSpaceResultDetailElementComponent;
}(MyDSpaceResultDetailElementComponent));
export { ClaimedMyDSpaceResultDetailElementComponent };
//# sourceMappingURL=claimed-my-dspace-result-detail-element.component.js.map
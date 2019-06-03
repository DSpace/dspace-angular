import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { isNotUndefined } from '../../../empty.util';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders pool task object for the mydspace result in the list view.
 */
var PoolMyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PoolMyDSpaceResultListElementComponent, _super);
    function PoolMyDSpaceResultListElementComponent(listable, index) {
        var _this = _super.call(this, listable, index) || this;
        _this.listable = listable;
        _this.index = index;
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
    PoolMyDSpaceResultListElementComponent.prototype.ngOnInit = function () {
        this.initWorkflowItem(this.dso.workflowitem);
    };
    /**
     * Retrieve workflowitem from result object
     */
    PoolMyDSpaceResultListElementComponent.prototype.initWorkflowItem = function (wfi$) {
        var _this = this;
        wfi$.pipe(find(function (rd) { return (rd.hasSucceeded && isNotUndefined(rd.payload)); })).subscribe(function (rd) {
            _this.workflowitem = rd.payload;
        });
    };
    PoolMyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-pool-my-dspace-result-list-element',
            styleUrls: ['../my-dspace-result-list-element.component.scss'],
            templateUrl: './pool-my-dspace-result-list-element.component.html',
        }),
        renderElementsFor(PoolTaskMyDSpaceResult, SetViewMode.List),
        renderElementsFor(PoolTask, SetViewMode.List),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__param(1, Inject('indexElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, Number])
    ], PoolMyDSpaceResultListElementComponent);
    return PoolMyDSpaceResultListElementComponent;
}(MyDSpaceResultListElementComponent));
export { PoolMyDSpaceResultListElementComponent };
//# sourceMappingURL=pool-my-dspace-result-list-element.component.js.map
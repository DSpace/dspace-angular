import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { isNotUndefined } from '../../../empty.util';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders workflowitem object for the mydspace result in the list view.
 */
var WorkflowitemMyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkflowitemMyDSpaceResultListElementComponent, _super);
    function WorkflowitemMyDSpaceResultListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Represent item's status
         */
        _this.status = MyDspaceItemStatusType.WORKFLOW;
        return _this;
    }
    /**
     * Initialize all instance variables
     */
    WorkflowitemMyDSpaceResultListElementComponent.prototype.ngOnInit = function () {
        this.initItem(this.dso.item);
    };
    /**
     * Retrieve item from result object
     */
    WorkflowitemMyDSpaceResultListElementComponent.prototype.initItem = function (item$) {
        var _this = this;
        item$.pipe(find(function (rd) { return rd.hasSucceeded && isNotUndefined(rd.payload); })).subscribe(function (rd) {
            _this.item = rd.payload;
        });
    };
    WorkflowitemMyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workflowitem-my-dspace-result-list-element',
            styleUrls: ['../my-dspace-result-list-element.component.scss'],
            templateUrl: './workflowitem-my-dspace-result-list-element.component.html',
        }),
        renderElementsFor(WorkflowitemMyDSpaceResult, SetViewMode.List),
        renderElementsFor(Workflowitem, SetViewMode.List)
    ], WorkflowitemMyDSpaceResultListElementComponent);
    return WorkflowitemMyDSpaceResultListElementComponent;
}(MyDSpaceResultListElementComponent));
export { WorkflowitemMyDSpaceResultListElementComponent };
//# sourceMappingURL=workflowitem-my-dspace-result-list-element.component.js.map
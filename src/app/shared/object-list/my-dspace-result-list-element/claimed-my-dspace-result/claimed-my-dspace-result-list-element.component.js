import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { find } from 'rxjs/operators';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { isNotUndefined } from '../../../empty.util';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';
/**
 * This component renders claimed task object for the mydspace result in the list view.
 */
var ClaimedMyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ClaimedMyDSpaceResultListElementComponent, _super);
    function ClaimedMyDSpaceResultListElementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
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
    ClaimedMyDSpaceResultListElementComponent.prototype.ngOnInit = function () {
        this.initWorkflowItem(this.dso.workflowitem);
    };
    /**
     * Retrieve workflowitem from result object
     */
    ClaimedMyDSpaceResultListElementComponent.prototype.initWorkflowItem = function (wfi$) {
        var _this = this;
        wfi$.pipe(find(function (rd) { return (rd.hasSucceeded && isNotUndefined(rd.payload)); })).subscribe(function (rd) {
            _this.workflowitem = rd.payload;
        });
    };
    ClaimedMyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-my-dspace-result-list-element',
            styleUrls: ['../my-dspace-result-list-element.component.scss'],
            templateUrl: './claimed-my-dspace-result-list-element.component.html',
            providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
        }),
        renderElementsFor(ClaimedTaskMyDSpaceResult, SetViewMode.List),
        renderElementsFor(ClaimedTask, SetViewMode.List)
    ], ClaimedMyDSpaceResultListElementComponent);
    return ClaimedMyDSpaceResultListElementComponent;
}(MyDSpaceResultListElementComponent));
export { ClaimedMyDSpaceResultListElementComponent };
//# sourceMappingURL=claimed-my-dspace-result-list-element.component.js.map
import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { isNotUndefined } from '../../empty.util';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * This component represents mydspace actions related to ClaimedTask object.
 */
var ClaimedTaskActionsComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ClaimedTaskActionsComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     * @param {Router} router
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function ClaimedTaskActionsComponent(injector, router, notificationsService, translate) {
        var _this = _super.call(this, ResourceType.ClaimedTask, injector, router, notificationsService, translate) || this;
        _this.injector = injector;
        _this.router = router;
        _this.notificationsService = notificationsService;
        _this.translate = translate;
        /**
         * A boolean representing if an approve operation is pending
         */
        _this.processingApprove$ = new BehaviorSubject(false);
        /**
         * A boolean representing if a reject operation is pending
         */
        _this.processingReject$ = new BehaviorSubject(false);
        /**
         * A boolean representing if a return to pool operation is pending
         */
        _this.processingReturnToPool$ = new BehaviorSubject(false);
        return _this;
    }
    /**
     * Initialize objects
     */
    ClaimedTaskActionsComponent.prototype.ngOnInit = function () {
        this.initObjects(this.object);
    };
    /**
     * Init the ClaimedTask and Workflowitem objects
     *
     * @param {PoolTask} object
     */
    ClaimedTaskActionsComponent.prototype.initObjects = function (object) {
        this.object = object;
        this.workflowitem$ = this.object.workflowitem.pipe(filter(function (rd) { return ((!rd.isRequestPending) && isNotUndefined(rd.payload)); }), map(function (rd) { return rd.payload; }));
    };
    /**
     * Approve the task.
     */
    ClaimedTaskActionsComponent.prototype.approve = function () {
        var _this = this;
        this.processingApprove$.next(true);
        this.objectDataService.approveTask(this.object.id)
            .subscribe(function (res) {
            _this.processingApprove$.next(false);
            _this.handleActionResponse(res.hasSucceeded);
        });
    };
    /**
     * Reject the task.
     */
    ClaimedTaskActionsComponent.prototype.reject = function (reason) {
        var _this = this;
        this.processingReject$.next(true);
        this.objectDataService.rejectTask(reason, this.object.id)
            .subscribe(function (res) {
            _this.processingReject$.next(false);
            _this.handleActionResponse(res.hasSucceeded);
        });
    };
    /**
     * Return task to the pool.
     */
    ClaimedTaskActionsComponent.prototype.returnToPool = function () {
        var _this = this;
        this.processingReturnToPool$.next(true);
        this.objectDataService.returnToPoolTask(this.object.id)
            .subscribe(function (res) {
            _this.processingReturnToPool$.next(false);
            _this.handleActionResponse(res.hasSucceeded);
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", ClaimedTask)
    ], ClaimedTaskActionsComponent.prototype, "object", void 0);
    ClaimedTaskActionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-task-actions',
            styleUrls: ['./claimed-task-actions.component.scss'],
            templateUrl: './claimed-task-actions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Injector,
            Router,
            NotificationsService,
            TranslateService])
    ], ClaimedTaskActionsComponent);
    return ClaimedTaskActionsComponent;
}(MyDSpaceActionsComponent));
export { ClaimedTaskActionsComponent };
//# sourceMappingURL=claimed-task-actions.component.js.map
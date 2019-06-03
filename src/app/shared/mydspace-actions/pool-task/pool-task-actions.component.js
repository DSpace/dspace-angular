import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { isNotUndefined } from '../../empty.util';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * This component represents mydspace actions related to PoolTask object.
 */
var PoolTaskActionsComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PoolTaskActionsComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     * @param {Router} router
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function PoolTaskActionsComponent(injector, router, notificationsService, translate) {
        var _this = _super.call(this, ResourceType.PoolTask, injector, router, notificationsService, translate) || this;
        _this.injector = injector;
        _this.router = router;
        _this.notificationsService = notificationsService;
        _this.translate = translate;
        /**
         * A boolean representing if a claim operation is pending
         * @type {BehaviorSubject<boolean>}
         */
        _this.processingClaim$ = new BehaviorSubject(false);
        return _this;
    }
    /**
     * Initialize objects
     */
    PoolTaskActionsComponent.prototype.ngOnInit = function () {
        this.initObjects(this.object);
    };
    /**
     * Init the PoolTask and Workflowitem objects
     *
     * @param {PoolTask} object
     */
    PoolTaskActionsComponent.prototype.initObjects = function (object) {
        this.object = object;
        this.workflowitem$ = this.object.workflowitem.pipe(filter(function (rd) { return ((!rd.isRequestPending) && isNotUndefined(rd.payload)); }), map(function (rd) { return rd.payload; }));
    };
    /**
     * Claim the task.
     */
    PoolTaskActionsComponent.prototype.claim = function () {
        var _this = this;
        this.processingClaim$.next(true);
        this.objectDataService.claimTask(this.object.id)
            .subscribe(function (res) {
            _this.handleActionResponse(res.hasSucceeded);
            _this.processingClaim$.next(false);
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PoolTask)
    ], PoolTaskActionsComponent.prototype, "object", void 0);
    PoolTaskActionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-pool-task-actions',
            styleUrls: ['./pool-task-actions.component.scss'],
            templateUrl: './pool-task-actions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Injector,
            Router,
            NotificationsService,
            TranslateService])
    ], PoolTaskActionsComponent);
    return PoolTaskActionsComponent;
}(MyDSpaceActionsComponent));
export { PoolTaskActionsComponent };
//# sourceMappingURL=pool-task-actions.component.js.map
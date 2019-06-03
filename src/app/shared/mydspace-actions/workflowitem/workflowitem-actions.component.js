import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * This component represents mydspace actions related to Workflowitem object.
 */
var WorkflowitemActionsComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkflowitemActionsComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     * @param {Router} router
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function WorkflowitemActionsComponent(injector, router, notificationsService, translate) {
        var _this = _super.call(this, ResourceType.Workflowitem, injector, router, notificationsService, translate) || this;
        _this.injector = injector;
        _this.router = router;
        _this.notificationsService = notificationsService;
        _this.translate = translate;
        return _this;
    }
    /**
     * Init the target object
     *
     * @param {Workflowitem} object
     */
    WorkflowitemActionsComponent.prototype.initObjects = function (object) {
        this.object = object;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Workflowitem)
    ], WorkflowitemActionsComponent.prototype, "object", void 0);
    WorkflowitemActionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workflowitem-actions',
            styleUrls: ['./workflowitem-actions.component.scss'],
            templateUrl: './workflowitem-actions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Injector,
            Router,
            NotificationsService,
            TranslateService])
    ], WorkflowitemActionsComponent);
    return WorkflowitemActionsComponent;
}(MyDSpaceActionsComponent));
export { WorkflowitemActionsComponent };
//# sourceMappingURL=workflowitem-actions.component.js.map
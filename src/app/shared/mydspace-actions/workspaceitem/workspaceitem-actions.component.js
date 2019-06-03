import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * This component represents mydspace actions related to Workspaceitem object.
 */
var WorkspaceitemActionsComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WorkspaceitemActionsComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     * @param {Router} router
     * @param {NgbModal} modalService
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function WorkspaceitemActionsComponent(injector, router, modalService, notificationsService, translate) {
        var _this = _super.call(this, ResourceType.Workspaceitem, injector, router, notificationsService, translate) || this;
        _this.injector = injector;
        _this.router = router;
        _this.modalService = modalService;
        _this.notificationsService = notificationsService;
        _this.translate = translate;
        /**
         * A boolean representing if a delete operation is pending
         * @type {BehaviorSubject<boolean>}
         */
        _this.processingDelete$ = new BehaviorSubject(false);
        return _this;
    }
    /**
     * Delete the target workspaceitem object
     */
    WorkspaceitemActionsComponent.prototype.confirmDiscard = function (content) {
        var _this = this;
        this.modalService.open(content).result.then(function (result) {
            if (result === 'ok') {
                _this.processingDelete$.next(true);
                _this.objectDataService.delete(_this.object)
                    .subscribe(function (response) {
                    _this.processingDelete$.next(false);
                    _this.handleActionResponse(response);
                });
            }
        });
    };
    /**
     * Init the target object
     *
     * @param {Workspaceitem} object
     */
    WorkspaceitemActionsComponent.prototype.initObjects = function (object) {
        this.object = object;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Workspaceitem)
    ], WorkspaceitemActionsComponent.prototype, "object", void 0);
    WorkspaceitemActionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-workspaceitem-actions',
            styleUrls: ['./workspaceitem-actions.component.scss'],
            templateUrl: './workspaceitem-actions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Injector,
            Router,
            NgbModal,
            NotificationsService,
            TranslateService])
    ], WorkspaceitemActionsComponent);
    return WorkspaceitemActionsComponent;
}(MyDSpaceActionsComponent));
export { WorkspaceitemActionsComponent };
//# sourceMappingURL=workspaceitem-actions.component.js.map
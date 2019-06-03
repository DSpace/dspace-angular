import * as tslib_1 from "tslib";
import { Input } from '@angular/core';
import { find } from 'rxjs/operators';
import { MydspaceActionsServiceFactory } from './mydspace-actions-service.factory';
import { NotificationOptions } from '../notifications/models/notification-options.model';
/**
 * Abstract class for all different representations of mydspace actions
 */
var MyDSpaceActionsComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ResourceType} objectType
     * @param {Injector} injector
     * @param {Router} router
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function MyDSpaceActionsComponent(objectType, injector, router, notificationsService, translate) {
        this.objectType = objectType;
        this.injector = injector;
        this.router = router;
        this.notificationsService = notificationsService;
        this.translate = translate;
        var factory = new MydspaceActionsServiceFactory();
        this.objectDataService = injector.get(factory.getConstructor(objectType));
    }
    /**
     * Refresh current page
     */
    MyDSpaceActionsComponent.prototype.reload = function () {
        // override the route reuse strategy
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.navigated = false;
        var url = decodeURIComponent(this.router.url);
        this.router.navigateByUrl(url);
    };
    /**
     * Override the target object with a refreshed one
     */
    MyDSpaceActionsComponent.prototype.refresh = function () {
        var _this = this;
        // find object by id
        this.objectDataService.findById(this.object.id).pipe(find(function (rd) { return rd.hasSucceeded; })).subscribe(function (rd) {
            _this.initObjects(rd.payload);
        });
    };
    /**
     * Handle action response and show properly notification
     *
     * @param result
     *    true on success, false otherwise
     */
    MyDSpaceActionsComponent.prototype.handleActionResponse = function (result) {
        if (result) {
            this.reload();
            this.notificationsService.success(null, this.translate.get('submission.workflow.tasks.generic.success'), new NotificationOptions(5000, false));
        }
        else {
            this.notificationsService.error(null, this.translate.get('submission.workflow.tasks.generic.error'), new NotificationOptions(20000, true));
        }
    };
    var _a;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", typeof (_a = typeof T !== "undefined" && T) === "function" && _a || Object)
    ], MyDSpaceActionsComponent.prototype, "object", void 0);
    return MyDSpaceActionsComponent;
}());
export { MyDSpaceActionsComponent };
//# sourceMappingURL=mydspace-actions.js.map
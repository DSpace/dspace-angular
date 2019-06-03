import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
/**
 * This component allows to submit a new workspaceitem.
 */
var SubmissionSubmitComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {NotificationsService} notificationsService
     * @param {SubmissionService} submissioService
     * @param {Router} router
     * @param {TranslateService} translate
     * @param {ViewContainerRef} viewContainerRef
     */
    function SubmissionSubmitComponent(changeDetectorRef, notificationsService, router, submissioService, translate, viewContainerRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.notificationsService = notificationsService;
        this.router = router;
        this.submissioService = submissioService;
        this.translate = translate;
        this.viewContainerRef = viewContainerRef;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Create workspaceitem on the server and initialize all instance variables
     */
    SubmissionSubmitComponent.prototype.ngOnInit = function () {
        var _this = this;
        // NOTE execute the code on the browser side only, otherwise it is executed twice
        this.subs.push(this.submissioService.createSubmission()
            .subscribe(function (submissionObject) {
            // NOTE new submission is created on the browser side only
            if (isNotNull(submissionObject)) {
                if (isEmpty(submissionObject)) {
                    _this.notificationsService.info(null, _this.translate.get('submission.general.cannot_submit'));
                    _this.router.navigate(['/mydspace']);
                }
                else {
                    _this.collectionId = submissionObject.collection.id;
                    _this.selfUrl = submissionObject.self;
                    _this.submissionDefinition = submissionObject.submissionDefinition;
                    _this.submissionId = submissionObject.id;
                    _this.changeDetectorRef.detectChanges();
                }
            }
        }));
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionSubmitComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
        this.viewContainerRef.clear();
        this.changeDetectorRef.markForCheck();
    };
    SubmissionSubmitComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-submit',
            styleUrls: ['./submission-submit.component.scss'],
            templateUrl: './submission-submit.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            NotificationsService,
            Router,
            SubmissionService,
            TranslateService,
            ViewContainerRef])
    ], SubmissionSubmitComponent);
    return SubmissionSubmitComponent;
}());
export { SubmissionSubmitComponent };
//# sourceMappingURL=submission-submit.component.js.map
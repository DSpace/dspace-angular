import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionService } from '../submission.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
/**
 * This component allows to edit an existing workspaceitem/workflowitem.
 */
var SubmissionEditComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {NotificationsService} notificationsService
     * @param {ActivatedRoute} route
     * @param {Router} router
     * @param {SubmissionService} submissionService
     * @param {TranslateService} translate
     */
    function SubmissionEditComponent(changeDetectorRef, notificationsService, route, router, submissionService, translate) {
        this.changeDetectorRef = changeDetectorRef;
        this.notificationsService = notificationsService;
        this.route = route;
        this.router = router;
        this.submissionService = submissionService;
        this.translate = translate;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Retrieve workspaceitem/workflowitem from server and initialize all instance variables
     */
    SubmissionEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subs.push(this.route.paramMap.pipe(switchMap(function (params) { return _this.submissionService.retrieveSubmission(params.get('id')); }), 
        // NOTE new submission is retrieved on the browser side only, so get null on server side rendering
        filter(function (submissionObjectRD) { return isNotNull(submissionObjectRD); })).subscribe(function (submissionObjectRD) {
            if (submissionObjectRD.hasSucceeded) {
                if (isEmpty(submissionObjectRD.payload)) {
                    _this.notificationsService.info(null, _this.translate.get('submission.general.cannot_submit'));
                    _this.router.navigate(['/mydspace']);
                }
                else {
                    _this.submissionId = submissionObjectRD.payload.id.toString();
                    _this.collectionId = submissionObjectRD.payload.collection.id;
                    _this.selfUrl = submissionObjectRD.payload.self;
                    _this.sections = submissionObjectRD.payload.sections;
                    _this.submissionDefinition = submissionObjectRD.payload.submissionDefinition;
                    _this.changeDetectorRef.detectChanges();
                }
            }
            else {
                if (submissionObjectRD.error.statusCode === 404) {
                    // redirect to not found page
                    _this.router.navigate(['/404'], { skipLocationChange: true });
                }
                // TODO handle generic error
            }
        }));
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionEditComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
    };
    SubmissionEditComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-edit',
            styleUrls: ['./submission-edit.component.scss'],
            templateUrl: './submission-edit.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            NotificationsService,
            ActivatedRoute,
            Router,
            SubmissionService,
            TranslateService])
    ], SubmissionEditComponent);
    return SubmissionEditComponent;
}());
export { SubmissionEditComponent };
//# sourceMappingURL=submission-edit.component.js.map
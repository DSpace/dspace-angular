import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { SectionsService } from '../../sections/sections.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { normalizeSectionData } from '../../../core/submission/submission-response-parsing.service';
import { SubmissionService } from '../../submission.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { UploaderOptions } from '../../../shared/uploader/uploader-options.model';
import parseSectionErrors from '../../utils/parseSectionErrors';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
/**
 * This component represents the drop zone that provides to add files to the submission.
 */
var SubmissionUploadFilesComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {NotificationsService} notificationsService
     * @param {SubmissionJsonPatchOperationsService} operationsService
     * @param {SectionsService} sectionService
     * @param {SubmissionService} submissionService
     * @param {TranslateService} translate
     */
    function SubmissionUploadFilesComponent(notificationsService, operationsService, sectionService, submissionService, translate) {
        var _this = this;
        this.notificationsService = notificationsService;
        this.operationsService = operationsService;
        this.sectionService = sectionService;
        this.submissionService = submissionService;
        this.translate = translate;
        /**
         * A boolean representing if is possible to active drop zone over the document page
         * @type {boolean}
         */
        this.enableDragOverDocument = true;
        /**
         * i18n message label
         * @type {string}
         */
        this.dropOverDocumentMsg = 'submission.sections.upload.drop-message';
        /**
         * i18n message label
         * @type {string}
         */
        this.dropMsg = 'submission.sections.upload.drop-message';
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
        /**
         * A boolean representing if upload functionality is enabled
         * @type {boolean}
         */
        this.uploadEnabled = observableOf(false);
        /**
         * Save submission before to upload a file
         */
        this.onBeforeUpload = function () {
            var sub = _this.operationsService.jsonPatchByResourceType(_this.submissionService.getSubmissionObjectLinkName(), _this.submissionId, 'sections')
                .subscribe();
            _this.subs.push(sub);
            return sub;
        };
    }
    /**
     * Check if upload functionality is enabled
     */
    SubmissionUploadFilesComponent.prototype.ngOnChanges = function () {
        this.uploadEnabled = this.sectionService.isSectionAvailable(this.submissionId, this.sectionId);
    };
    /**
     * Parse the submission object retrieved from REST after upload
     *
     * @param workspaceitem
     *    The submission object retrieved from REST
     */
    SubmissionUploadFilesComponent.prototype.onCompleteItem = function (workspaceitem) {
        var _this = this;
        // Checks if upload section is enabled so do upload
        this.subs.push(this.uploadEnabled
            .pipe(first())
            .subscribe(function (isUploadEnabled) {
            if (isUploadEnabled) {
                var sections_1 = workspaceitem.sections;
                var errors = workspaceitem.errors;
                var errorsList_1 = parseSectionErrors(errors);
                if (sections_1 && isNotEmpty(sections_1)) {
                    Object.keys(sections_1)
                        .forEach(function (sectionId) {
                        var sectionData = normalizeSectionData(sections_1[sectionId]);
                        var sectionErrors = errorsList_1[sectionId];
                        if (sectionId === 'upload') {
                            // Look for errors on upload
                            if ((isEmpty(sectionErrors))) {
                                _this.notificationsService.success(null, _this.translate.get('submission.sections.upload.upload-successful'));
                            }
                            else {
                                _this.notificationsService.error(null, _this.translate.get('submission.sections.upload.upload-failed'));
                            }
                        }
                        _this.sectionService.updateSectionData(_this.submissionId, sectionId, sectionData, sectionErrors);
                    });
                }
            }
        }));
    };
    /**
     * Show error notification on upload fails
     */
    SubmissionUploadFilesComponent.prototype.onUploadError = function () {
        this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionUploadFilesComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionUploadFilesComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionUploadFilesComponent.prototype, "submissionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionUploadFilesComponent.prototype, "sectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", UploaderOptions)
    ], SubmissionUploadFilesComponent.prototype, "uploadFilesOptions", void 0);
    SubmissionUploadFilesComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-upload-files',
            templateUrl: './submission-upload-files.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NotificationsService,
            SubmissionJsonPatchOperationsService,
            SectionsService,
            SubmissionService,
            TranslateService])
    ], SubmissionUploadFilesComponent);
    return SubmissionUploadFilesComponent;
}());
export { SubmissionUploadFilesComponent };
//# sourceMappingURL=submission-upload-files.component.js.map
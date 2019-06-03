import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { SubmissionService } from '../submission.service';
import { AuthService } from '../../core/auth/auth.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
/**
 * This component represents the submission form.
 */
var SubmissionFormComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {AuthService} authService
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {HALEndpointService} halService
     * @param {SubmissionService} submissionService
     */
    function SubmissionFormComponent(authService, changeDetectorRef, halService, submissionService) {
        this.authService = authService;
        this.changeDetectorRef = changeDetectorRef;
        this.halService = halService;
        this.submissionService = submissionService;
        /**
         * A boolean representing if a submission form is pending
         * @type {Observable<boolean>}
         */
        this.loading = observableOf(true);
        /**
         * The uploader configuration options
         * @type {UploaderOptions}
         */
        this.uploadFilesOptions = {
            url: '',
            authToken: null,
            disableMultipart: false,
            itemAlias: null
        };
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
        this.isActive = true;
    }
    /**
     * Initialize all instance variables and retrieve form configuration
     */
    SubmissionFormComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.collectionId && this.submissionId) {
            this.isActive = true;
            // retrieve submission's section list
            this.submissionSections = this.submissionService.getSubmissionObject(this.submissionId).pipe(filter(function () { return _this.isActive; }), map(function (submission) { return submission.isLoading; }), map(function (isLoading) { return isLoading; }), distinctUntilChanged(), flatMap(function (isLoading) {
                if (!isLoading) {
                    return _this.getSectionsList();
                }
                else {
                    return observableOf([]);
                }
            }));
            // check if is submission loading
            this.loading = this.submissionService.getSubmissionObject(this.submissionId).pipe(filter(function () { return _this.isActive; }), map(function (submission) { return submission.isLoading; }), map(function (isLoading) { return isLoading; }), distinctUntilChanged());
            // init submission state
            this.subs.push(this.halService.getEndpoint('workspaceitems').pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged())
                .subscribe(function (endpointURL) {
                _this.uploadFilesOptions.authToken = _this.authService.buildAuthHeader();
                _this.uploadFilesOptions.url = endpointURL.concat("/" + _this.submissionId);
                _this.definitionId = _this.submissionDefinition.name;
                _this.submissionService.dispatchInit(_this.collectionId, _this.submissionId, _this.selfUrl, _this.submissionDefinition, _this.sections, null);
                _this.changeDetectorRef.detectChanges();
            }));
            // start auto save
            this.submissionService.startAutoSave(this.submissionId);
        }
    };
    /**
     * Unsubscribe from all subscriptions, destroy instance variables
     * and reset submission state
     */
    SubmissionFormComponent.prototype.ngOnDestroy = function () {
        this.isActive = false;
        this.submissionService.stopAutoSave();
        this.submissionService.resetAllSubmissionObjects();
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * On collection change reset submission state in case of it has a different
     * submission definition
     *
     * @param submissionObject
     *    new submission object
     */
    SubmissionFormComponent.prototype.onCollectionChange = function (submissionObject) {
        this.collectionId = submissionObject.collection.id;
        if (this.definitionId !== submissionObject.submissionDefinition.name) {
            this.sections = submissionObject.sections;
            this.submissionDefinition = submissionObject.submissionDefinition;
            this.definitionId = this.submissionDefinition.name;
            this.submissionService.resetSubmissionObject(this.collectionId, this.submissionId, submissionObject.self, this.submissionDefinition, this.sections);
        }
        else {
            this.changeDetectorRef.detectChanges();
        }
    };
    /**
     * Check if submission form is loading
     */
    SubmissionFormComponent.prototype.isLoading = function () {
        return this.loading;
    };
    /**
     * Check if submission form is loading
     */
    SubmissionFormComponent.prototype.getSectionsList = function () {
        return this.submissionService.getSubmissionSections(this.submissionId).pipe(filter(function (sections) { return isNotEmpty(sections); }), map(function (sections) { return sections; }));
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", WorkspaceitemSectionsObject)
    ], SubmissionFormComponent.prototype, "sections", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormComponent.prototype, "selfUrl", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SubmissionDefinitionsModel)
    ], SubmissionFormComponent.prototype, "submissionDefinition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormComponent.prototype, "submissionId", void 0);
    SubmissionFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-form',
            styleUrls: ['./submission-form.component.scss'],
            templateUrl: './submission-form.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService,
            ChangeDetectorRef,
            HALEndpointService,
            SubmissionService])
    ], SubmissionFormComponent);
    return SubmissionFormComponent;
}());
export { SubmissionFormComponent };
//# sourceMappingURL=submission-form.component.js.map
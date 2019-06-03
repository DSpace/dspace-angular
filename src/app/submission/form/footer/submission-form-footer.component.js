import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { isNotEmpty } from '../../../shared/empty.util';
/**
 * This component represents submission form footer bar.
 */
var SubmissionFormFooterComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {NgbModal} modalService
     * @param {SubmissionRestService} restService
     * @param {SubmissionService} submissionService
     */
    function SubmissionFormFooterComponent(modalService, restService, submissionService) {
        this.modalService = modalService;
        this.restService = restService;
        this.submissionService = submissionService;
        /**
         * A boolean representing if submission form is valid or not
         * @type {Observable<boolean>}
         */
        this.submissionIsInvalid = observableOf(true);
    }
    /**
     * Initialize all instance variables
     */
    SubmissionFormFooterComponent.prototype.ngOnChanges = function (changes) {
        if (isNotEmpty(this.submissionId)) {
            this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(map(function (isValid) { return isValid === false; }));
            this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
            this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
            this.showDepositAndDiscard = observableOf(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
        }
    };
    /**
     * Dispatch a submission save action
     */
    SubmissionFormFooterComponent.prototype.save = function (event) {
        this.submissionService.dispatchSave(this.submissionId);
    };
    /**
     * Dispatch a submission save for later action
     */
    SubmissionFormFooterComponent.prototype.saveLater = function (event) {
        this.submissionService.dispatchSaveForLater(this.submissionId);
    };
    /**
     * Dispatch a submission deposit action
     */
    SubmissionFormFooterComponent.prototype.deposit = function (event) {
        this.submissionService.dispatchDeposit(this.submissionId);
    };
    /**
     * Dispatch a submission discard action
     */
    SubmissionFormFooterComponent.prototype.confirmDiscard = function (content) {
        var _this = this;
        this.modalService.open(content).result.then(function (result) {
            if (result === 'ok') {
                _this.submissionService.dispatchDiscard(_this.submissionId);
            }
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormFooterComponent.prototype, "submissionId", void 0);
    SubmissionFormFooterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-form-footer',
            styleUrls: ['./submission-form-footer.component.scss'],
            templateUrl: './submission-form-footer.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [NgbModal,
            SubmissionRestService,
            SubmissionService])
    ], SubmissionFormFooterComponent);
    return SubmissionFormFooterComponent;
}());
export { SubmissionFormFooterComponent };
//# sourceMappingURL=submission-form-footer.component.js.map
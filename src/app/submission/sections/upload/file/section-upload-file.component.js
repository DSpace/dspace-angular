import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, first, flatMap, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionUploadService } from '../section-upload.service';
import { isNotEmpty, isNotNull, isNotUndefined } from '../../../../shared/empty.util';
import { FormService } from '../../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionFormsModel } from '../../../../core/config/models/config-submission-forms.model';
import { deleteProperty } from '../../../../shared/object.util';
import { dateToISOFormat } from '../../../../shared/date.util';
import { SubmissionService } from '../../../submission.service';
import { FileService } from '../../../../core/shared/file.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { SubmissionSectionUploadFileEditComponent } from './edit/section-upload-file-edit.component';
/**
 * This component represents a single bitstream contained in the submission
 */
var SubmissionSectionUploadFileComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} cdr
     * @param {FileService} fileService
     * @param {FormService} formService
     * @param {HALEndpointService} halService
     * @param {NgbModal} modalService
     * @param {JsonPatchOperationsBuilder} operationsBuilder
     * @param {SubmissionJsonPatchOperationsService} operationsService
     * @param {SubmissionService} submissionService
     * @param {SectionUploadService} uploadService
     */
    function SubmissionSectionUploadFileComponent(cdr, fileService, formService, halService, modalService, operationsBuilder, operationsService, submissionService, uploadService) {
        this.cdr = cdr;
        this.fileService = fileService;
        this.formService = formService;
        this.halService = halService;
        this.modalService = modalService;
        this.operationsBuilder = operationsBuilder;
        this.operationsService = operationsService;
        this.submissionService = submissionService;
        this.uploadService = uploadService;
        /**
         * A boolean representing if a submission delete operation is pending
         * @type {BehaviorSubject<boolean>}
         */
        this.processingDelete$ = new BehaviorSubject(false);
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subscriptions = [];
        this.readMode = true;
    }
    /**
     * Retrieve bitstream's metadata
     */
    SubmissionSectionUploadFileComponent.prototype.ngOnChanges = function () {
        var _this = this;
        if (this.availableAccessConditionOptions && this.availableAccessConditionGroups) {
            // Retrieve file state
            this.subscriptions.push(this.uploadService
                .getFileData(this.submissionId, this.sectionId, this.fileId).pipe(filter(function (bitstream) { return isNotUndefined(bitstream); }))
                .subscribe(function (bitstream) {
                _this.fileData = bitstream;
            }));
        }
    };
    /**
     * Initialize instance variables
     */
    SubmissionSectionUploadFileComponent.prototype.ngOnInit = function () {
        this.formId = this.formService.getUniqueId(this.fileId);
        this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'files', this.fileIndex);
    };
    /**
     * Delete bitstream from submission
     */
    SubmissionSectionUploadFileComponent.prototype.deleteFile = function () {
        var _this = this;
        this.operationsBuilder.remove(this.pathCombiner.getPath());
        this.subscriptions.push(this.operationsService.jsonPatchByResourceID(this.submissionService.getSubmissionObjectLinkName(), this.submissionId, this.pathCombiner.rootElement, this.pathCombiner.subRootElement)
            .subscribe(function () {
            _this.uploadService.removeUploadedFile(_this.submissionId, _this.sectionId, _this.fileId);
            _this.processingDelete$.next(false);
        }));
    };
    /**
     * Show confirmation dialog for delete
     */
    SubmissionSectionUploadFileComponent.prototype.confirmDelete = function (content) {
        var _this = this;
        this.modalService.open(content).result.then(function (result) {
            if (result === 'ok') {
                _this.processingDelete$.next(true);
                _this.deleteFile();
            }
        });
    };
    /**
     * Perform bitstream download
     */
    SubmissionSectionUploadFileComponent.prototype.downloadBitstreamFile = function () {
        var _this = this;
        this.halService.getEndpoint('bitstreams').pipe(first())
            .subscribe(function (url) {
            var fileUrl = url + "/" + _this.fileData.uuid + "/content";
            _this.fileService.downloadFile(fileUrl);
        });
    };
    /**
     * Save bitstream metadata
     *
     * @param event
     *    the click event emitted
     */
    SubmissionSectionUploadFileComponent.prototype.saveBitstreamData = function (event) {
        var _this = this;
        event.preventDefault();
        // validate form
        this.formService.validateAllFormFields(this.fileEditComp.formRef.formGroup);
        this.subscriptions.push(this.formService.isValid(this.formId).pipe(take(1), filter(function (isValid) { return isValid; }), flatMap(function () { return _this.formService.getFormData(_this.formId); }), take(1), flatMap(function (formData) {
            // collect bitstream metadata
            Object.keys((formData.metadata))
                .filter(function (key) { return isNotEmpty(formData.metadata[key]); })
                .forEach(function (key) {
                var metadataKey = key.replace(/_/g, '.');
                var path = "metadata/" + metadataKey;
                _this.operationsBuilder.add(_this.pathCombiner.getPath(path), formData.metadata[key], true);
            });
            var accessConditionsToSave = [];
            formData.accessConditions
                .filter(function (accessCondition) { return isNotEmpty(accessCondition); })
                .forEach(function (accessCondition) {
                var accessConditionOpt;
                _this.availableAccessConditionOptions
                    .filter(function (element) { return isNotNull(accessCondition.name) && element.name === accessCondition.name[0].value; })
                    .forEach(function (element) { return accessConditionOpt = element; });
                if (accessConditionOpt) {
                    if (accessConditionOpt.hasStartDate !== true && accessConditionOpt.hasEndDate !== true) {
                        accessConditionOpt = deleteProperty(accessConditionOpt, 'hasStartDate');
                        accessConditionOpt = deleteProperty(accessConditionOpt, 'hasEndDate');
                        accessConditionsToSave.push(accessConditionOpt);
                    }
                    else {
                        accessConditionOpt = Object.assign({}, accessCondition);
                        accessConditionOpt.name = _this.retrieveValueFromField(accessCondition.name);
                        accessConditionOpt.groupUUID = _this.retrieveValueFromField(accessCondition.groupUUID);
                        if (accessCondition.startDate) {
                            var startDate = _this.retrieveValueFromField(accessCondition.startDate);
                            accessConditionOpt.startDate = dateToISOFormat(startDate);
                            accessConditionOpt = deleteProperty(accessConditionOpt, 'endDate');
                        }
                        if (accessCondition.endDate) {
                            var endDate = _this.retrieveValueFromField(accessCondition.endDate);
                            accessConditionOpt.endDate = dateToISOFormat(endDate);
                            accessConditionOpt = deleteProperty(accessConditionOpt, 'startDate');
                        }
                        accessConditionsToSave.push(accessConditionOpt);
                    }
                }
            });
            if (isNotEmpty(accessConditionsToSave)) {
                _this.operationsBuilder.add(_this.pathCombiner.getPath('accessConditions'), accessConditionsToSave, true);
            }
            // dispatch a PATCH request to save metadata
            return _this.operationsService.jsonPatchByResourceID(_this.submissionService.getSubmissionObjectLinkName(), _this.submissionId, _this.pathCombiner.rootElement, _this.pathCombiner.subRootElement);
        })).subscribe(function (result) {
            if (result[0].sections.upload) {
                Object.keys(result[0].sections.upload.files)
                    .filter(function (key) { return result[0].sections.upload.files[key].uuid === _this.fileId; })
                    .forEach(function (key) { return _this.uploadService.updateFileData(_this.submissionId, _this.sectionId, _this.fileId, result[0].sections.upload.files[key]); });
            }
            _this.switchMode();
        }));
    };
    /**
     * Retrieve field value
     *
     * @param field
     *    the specified field object
     */
    SubmissionSectionUploadFileComponent.prototype.retrieveValueFromField = function (field) {
        var temp = Array.isArray(field) ? field[0] : field;
        return (temp) ? temp.value : undefined;
    };
    /**
     * Switch from edit form to metadata view
     */
    SubmissionSectionUploadFileComponent.prototype.switchMode = function () {
        this.readMode = !this.readMode;
        this.cdr.detectChanges();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SubmissionSectionUploadFileComponent.prototype, "availableAccessConditionOptions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Map)
    ], SubmissionSectionUploadFileComponent.prototype, "availableAccessConditionGroups", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], SubmissionSectionUploadFileComponent.prototype, "collectionPolicyType", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SubmissionFormsModel)
    ], SubmissionSectionUploadFileComponent.prototype, "configMetadataForm", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "fileId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "fileIndex", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "fileName", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "sectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileComponent.prototype, "submissionId", void 0);
    tslib_1.__decorate([
        ViewChild(SubmissionSectionUploadFileEditComponent),
        tslib_1.__metadata("design:type", SubmissionSectionUploadFileEditComponent)
    ], SubmissionSectionUploadFileComponent.prototype, "fileEditComp", void 0);
    SubmissionSectionUploadFileComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-upload-section-file',
            styleUrls: ['./section-upload-file.component.scss'],
            templateUrl: './section-upload-file.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            FileService,
            FormService,
            HALEndpointService,
            NgbModal,
            JsonPatchOperationsBuilder,
            SubmissionJsonPatchOperationsService,
            SubmissionService,
            SectionUploadService])
    ], SubmissionSectionUploadFileComponent);
    return SubmissionSectionUploadFileComponent;
}());
export { SubmissionSectionUploadFileComponent };
//# sourceMappingURL=section-upload-file.component.js.map
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DeleteUploadedFileAction, EditFileDataAction, NewUploadedFileAction } from '../../objects/submission-objects.actions';
import { submissionUploadedFileFromUuidSelector, submissionUploadedFilesFromIdSelector } from '../../selectors';
import { isUndefined } from '../../../shared/empty.util';
/**
 * A service that provides methods to handle submission's bitstream state.
 */
var SectionUploadService = /** @class */ (function () {
    /**
     * Initialize service variables
     *
     * @param {Store<SubmissionState>} store
     */
    function SectionUploadService(store) {
        this.store = store;
    }
    /**
     * Return submission's bitstream list from state
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @returns {Array}
     *    Returns submission's bitstream list
     */
    SectionUploadService.prototype.getUploadedFileList = function (submissionId, sectionId) {
        return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId)).pipe(map(function (state) { return state; }), distinctUntilChanged());
    };
    /**
     * Return bitstream's metadata
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param fileUUID
     *    The bitstream UUID
     * @returns {Observable}
     *    Emits bitstream's metadata
     */
    SectionUploadService.prototype.getFileData = function (submissionId, sectionId, fileUUID) {
        return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId)).pipe(filter(function (state) { return !isUndefined(state); }), map(function (state) {
            var fileState;
            Object.keys(state)
                .filter(function (key) { return state[key].uuid === fileUUID; })
                .forEach(function (key) { return fileState = state[key]; });
            return fileState;
        }), distinctUntilChanged());
    };
    /**
     * Return bitstream's default policies
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param fileUUID
     *    The bitstream UUID
     * @returns {Observable}
     *    Emits bitstream's default policies
     */
    SectionUploadService.prototype.getDefaultPolicies = function (submissionId, sectionId, fileUUID) {
        return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, fileUUID)).pipe(map(function (state) { return state; }), distinctUntilChanged());
    };
    /**
     * Add a new bitstream to the state
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param fileUUID
     *    The bitstream UUID
     * @param data
     *    The [[WorkspaceitemSectionUploadFileObject]] object
     */
    SectionUploadService.prototype.addUploadedFile = function (submissionId, sectionId, fileUUID, data) {
        this.store.dispatch(new NewUploadedFileAction(submissionId, sectionId, fileUUID, data));
    };
    /**
     * Update bitstream metadata into the state
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param fileUUID
     *    The bitstream UUID
     * @param data
     *    The [[WorkspaceitemSectionUploadFileObject]] object
     */
    SectionUploadService.prototype.updateFileData = function (submissionId, sectionId, fileUUID, data) {
        this.store.dispatch(new EditFileDataAction(submissionId, sectionId, fileUUID, data));
    };
    /**
     * Remove bitstream from the state
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param fileUUID
     *    The bitstream UUID
     */
    SectionUploadService.prototype.removeUploadedFile = function (submissionId, sectionId, fileUUID) {
        this.store.dispatch(new DeleteUploadedFileAction(submissionId, sectionId, fileUUID));
    };
    SectionUploadService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], SectionUploadService);
    return SectionUploadService;
}());
export { SectionUploadService };
//# sourceMappingURL=section-upload.service.js.map
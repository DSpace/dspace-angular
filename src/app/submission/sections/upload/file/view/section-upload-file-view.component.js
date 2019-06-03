import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { WorkspaceitemSectionUploadFileObject } from '../../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { isNotEmpty } from '../../../../../shared/empty.util';
import { Metadata } from '../../../../../core/shared/metadata.utils';
/**
 * This component allow to show bitstream's metadata
 */
var SubmissionSectionUploadFileViewComponent = /** @class */ (function () {
    function SubmissionSectionUploadFileViewComponent() {
        /**
         * The [[MetadataMap]] object
         * @type {MetadataMap}
         */
        this.metadata = Object.create({});
        /**
         * The bitstream's title key
         * @type {string}
         */
        this.fileTitleKey = 'Title';
        /**
         * The bitstream's description key
         * @type {string}
         */
        this.fileDescrKey = 'Description';
    }
    /**
     * Initialize instance variables
     */
    SubmissionSectionUploadFileViewComponent.prototype.ngOnInit = function () {
        if (isNotEmpty(this.fileData.metadata)) {
            this.metadata[this.fileTitleKey] = Metadata.all(this.fileData.metadata, 'dc.title');
            this.metadata[this.fileDescrKey] = Metadata.all(this.fileData.metadata, 'dc.description');
        }
    };
    /**
     * Gets all matching metadata in the map(s)
     *
     * @param metadataKey
     *    The metadata key(s) in scope
     * @returns {MetadataValue[]}
     *    The matching values
     */
    SubmissionSectionUploadFileViewComponent.prototype.getAllMetadataValue = function (metadataKey) {
        return Metadata.all(this.metadata, metadataKey);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", WorkspaceitemSectionUploadFileObject)
    ], SubmissionSectionUploadFileViewComponent.prototype, "fileData", void 0);
    SubmissionSectionUploadFileViewComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-upload-file-view',
            templateUrl: './section-upload-file-view.component.html',
        })
    ], SubmissionSectionUploadFileViewComponent);
    return SubmissionSectionUploadFileViewComponent;
}());
export { SubmissionSectionUploadFileViewComponent };
//# sourceMappingURL=section-upload-file-view.component.js.map
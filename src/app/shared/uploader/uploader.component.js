import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation, } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { uniqueId } from 'lodash';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { UploaderOptions } from './uploader-options.model';
import { isNotEmpty, isUndefined } from '../empty.util';
import { UploaderService } from './uploader.service';
var UploaderComponent = /** @class */ (function () {
    function UploaderComponent(cdr, scrollToService, uploaderService) {
        this.cdr = cdr;
        this.scrollToService = scrollToService;
        this.uploaderService = uploaderService;
        /**
         * The function to call when upload is completed
         */
        this.onCompleteItem = new EventEmitter();
        /**
         * The function to call on error occurred
         */
        this.onUploadError = new EventEmitter();
        this.isOverBaseDropZone = observableOf(false);
        this.isOverDocumentDropZone = observableOf(false);
    }
    UploaderComponent.prototype.onDragOver = function (event) {
        if (this.enableDragOverDocument && this.uploaderService.isAllowedDragOverPage()) {
            // Show drop area on the page
            event.preventDefault();
            if (event.target.tagName !== 'HTML') {
                this.isOverDocumentDropZone = observableOf(true);
            }
        }
    };
    /**
     * Method provided by Angular. Invoked after the constructor.
     */
    UploaderComponent.prototype.ngOnInit = function () {
        this.uploaderId = 'ds-drag-and-drop-uploader' + uniqueId();
        this.checkConfig(this.uploadFilesOptions);
        this.uploader = new FileUploader({
            url: this.uploadFilesOptions.url,
            authToken: this.uploadFilesOptions.authToken,
            disableMultipart: this.uploadFilesOptions.disableMultipart,
            itemAlias: this.uploadFilesOptions.itemAlias,
            removeAfterUpload: true,
            autoUpload: true
        });
        if (isUndefined(this.enableDragOverDocument)) {
            this.enableDragOverDocument = false;
        }
        if (isUndefined(this.dropMsg)) {
            this.dropMsg = 'uploader.drag-message';
        }
        if (isUndefined(this.dropOverDocumentMsg)) {
            this.dropOverDocumentMsg = 'uploader.drag-message';
        }
    };
    UploaderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Maybe to remove: needed to avoid CORS issue with our temp upload server
        this.uploader.onAfterAddingFile = (function (item) {
            item.withCredentials = false;
        });
        if (isUndefined(this.onBeforeUpload)) {
            this.onBeforeUpload = function () { return; };
        }
        this.uploader.onBeforeUploadItem = function () {
            _this.onBeforeUpload();
            _this.isOverDocumentDropZone = observableOf(false);
            // Move page target to the uploader
            var config = {
                target: _this.uploaderId
            };
            _this.scrollToService.scrollTo(config);
        };
        this.uploader.onCompleteItem = function (item, response, status, headers) {
            if (isNotEmpty(response)) {
                var responsePath = JSON.parse(response);
                _this.onCompleteItem.emit(responsePath);
            }
        };
        this.uploader.onErrorItem = function (item, response, status, headers) {
            _this.onUploadError.emit(null);
            _this.uploader.cancelAll();
        };
        this.uploader.onProgressAll = function () { return _this.onProgress(); };
        this.uploader.onProgressItem = function () { return _this.onProgress(); };
    };
    /**
     * Called when files are dragged on the base drop area.
     */
    UploaderComponent.prototype.fileOverBase = function (isOver) {
        this.isOverBaseDropZone = observableOf(isOver);
    };
    /**
     * Called when files are dragged on the window document drop area.
     */
    UploaderComponent.prototype.fileOverDocument = function (isOver) {
        if (!isOver) {
            this.isOverDocumentDropZone = observableOf(isOver);
        }
    };
    UploaderComponent.prototype.onProgress = function () {
        this.cdr.detectChanges();
    };
    /**
     * Ensure options passed contains the required properties.
     *
     * @param fileUploadOptions
     *    The upload-files options object.
     */
    UploaderComponent.prototype.checkConfig = function (fileUploadOptions) {
        var required = ['url', 'authToken', 'disableMultipart', 'itemAlias'];
        var missing = required.filter(function (prop) {
            return !((prop in fileUploadOptions) && fileUploadOptions[prop] !== '');
        });
        if (0 < missing.length) {
            throw new Error('UploadFiles: Argument is missing the following required properties: ' + missing.join(', '));
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], UploaderComponent.prototype, "dropMsg", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], UploaderComponent.prototype, "dropOverDocumentMsg", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], UploaderComponent.prototype, "enableDragOverDocument", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function)
    ], UploaderComponent.prototype, "onBeforeUpload", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", UploaderOptions)
    ], UploaderComponent.prototype, "uploadFilesOptions", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], UploaderComponent.prototype, "onCompleteItem", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], UploaderComponent.prototype, "onUploadError", void 0);
    tslib_1.__decorate([
        HostListener('window:dragover', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], UploaderComponent.prototype, "onDragOver", null);
    UploaderComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-uploader',
            templateUrl: 'uploader.component.html',
            styleUrls: ['uploader.component.scss'],
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.Emulated
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef, ScrollToService, UploaderService])
    ], UploaderComponent);
    return UploaderComponent;
}());
export { UploaderComponent };
//# sourceMappingURL=uploader.component.js.map
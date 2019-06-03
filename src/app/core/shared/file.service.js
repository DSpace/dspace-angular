import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RestRequestMethod } from '../data/rest-request-method';
import { saveAs } from 'file-saver';
/**
 * Provides utility methods to save files on the client-side.
 */
var FileService = /** @class */ (function () {
    function FileService(restService) {
        this.restService = restService;
    }
    /**
     * Makes a HTTP Get request to download a file
     *
     * @param url
     *    file url
     */
    FileService.prototype.downloadFile = function (url) {
        var _this = this;
        var headers = new HttpHeaders();
        var options = Object.create({ headers: headers, responseType: 'blob' });
        return this.restService.request(RestRequestMethod.GET, url, null, options)
            .subscribe(function (data) {
            saveAs(data.payload, _this.getFileNameFromResponseContentDisposition(data));
        });
    };
    /**
     * Derives file name from the http response
     * by looking inside content-disposition
     * @param res
     *    http DSpaceRESTV2Response
     */
    FileService.prototype.getFileNameFromResponseContentDisposition = function (res) {
        // NOTE: to be able to retrieve 'Content-Disposition' header,
        // you need to set 'Access-Control-Expose-Headers': 'Content-Disposition' ON SERVER SIDE
        var contentDisposition = res.headers.get('content-disposition') || '';
        var matches = /filename="([^;]+)"/ig.exec(contentDisposition) || [];
        return (matches[1] || 'untitled').trim().replace(/\.[^/.]+$/, '');
    };
    ;
    FileService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSpaceRESTv2Service])
    ], FileService);
    return FileService;
}());
export { FileService };
//# sourceMappingURL=file.service.js.map
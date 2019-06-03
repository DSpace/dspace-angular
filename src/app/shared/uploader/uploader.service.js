import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var UploaderService = /** @class */ (function () {
    function UploaderService() {
        this._overrideDragOverPage = false;
    }
    UploaderService.prototype.overrideDragOverPage = function () {
        this._overrideDragOverPage = true;
    };
    UploaderService.prototype.allowDragOverPage = function () {
        this._overrideDragOverPage = false;
    };
    UploaderService.prototype.isAllowedDragOverPage = function () {
        return !this._overrideDragOverPage;
    };
    UploaderService = tslib_1.__decorate([
        Injectable()
    ], UploaderService);
    return UploaderService;
}());
export { UploaderService };
//# sourceMappingURL=uploader.service.js.map
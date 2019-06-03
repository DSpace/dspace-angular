import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as uuidv4 from 'uuid/v4';
var UUIDService = /** @class */ (function () {
    function UUIDService() {
    }
    UUIDService.prototype.generate = function () {
        return uuidv4();
    };
    UUIDService = tslib_1.__decorate([
        Injectable()
    ], UUIDService);
    return UUIDService;
}());
export { UUIDService };
//# sourceMappingURL=uuid.service.js.map
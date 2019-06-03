import * as tslib_1 from "tslib";
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';
var ServerResponseService = /** @class */ (function () {
    function ServerResponseService(response) {
        this.response = response;
    }
    ServerResponseService.prototype.setStatus = function (code, message) {
        if (this.response) {
            this.response.statusCode = code;
            if (message) {
                this.response.statusMessage = message;
            }
        }
        return this;
    };
    ServerResponseService.prototype.setNotFound = function (message) {
        if (message === void 0) { message = 'Not found'; }
        return this.setStatus(404, message);
    };
    ServerResponseService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Optional()), tslib_1.__param(0, Inject(RESPONSE)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], ServerResponseService);
    return ServerResponseService;
}());
export { ServerResponseService };
//# sourceMappingURL=server-response.service.js.map
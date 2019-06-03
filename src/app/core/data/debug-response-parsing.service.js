import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var DebugResponseParsingService = /** @class */ (function () {
    function DebugResponseParsingService() {
    }
    DebugResponseParsingService.prototype.parse = function (request, data) {
        console.log('request', request, 'data', data);
        return undefined;
    };
    DebugResponseParsingService = tslib_1.__decorate([
        Injectable()
    ], DebugResponseParsingService);
    return DebugResponseParsingService;
}());
export { DebugResponseParsingService };
//# sourceMappingURL=debug-response-parsing.service.js.map
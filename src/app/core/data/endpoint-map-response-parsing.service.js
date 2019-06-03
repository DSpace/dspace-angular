import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { ErrorResponse, EndpointMapSuccessResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
var EndpointMapResponseParsingService = /** @class */ (function () {
    function EndpointMapResponseParsingService(EnvConfig) {
        this.EnvConfig = EnvConfig;
    }
    EndpointMapResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
            var links = data.payload._links;
            for (var _i = 0, _a = Object.keys(links); _i < _a.length; _i++) {
                var link = _a[_i];
                links[link] = links[link].href;
            }
            return new EndpointMapSuccessResponse(links, data.statusCode, data.statusText);
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from root endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    EndpointMapResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], EndpointMapResponseParsingService);
    return EndpointMapResponseParsingService;
}());
export { EndpointMapResponseParsingService };
//# sourceMappingURL=endpoint-map-response-parsing.service.js.map
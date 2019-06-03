import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { EpersonSuccessResponse, ErrorResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
/**
 * Provides method to parse response from eperson endpoint.
 */
var EpersonResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(EpersonResponseParsingService, _super);
    function EpersonResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = NormalizedObjectFactory;
        _this.toCache = false;
        return _this;
    }
    EpersonResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
            var epersonDefinition = this.process(data.payload, request.href);
            return new EpersonSuccessResponse(epersonDefinition[Object.keys(epersonDefinition)[0]], data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from EPerson endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    EpersonResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], EpersonResponseParsingService);
    return EpersonResponseParsingService;
}(BaseResponseParsingService));
export { EpersonResponseParsingService };
//# sourceMappingURL=eperson-response-parsing.service.js.map
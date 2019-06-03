import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { DSOSuccessResponse } from '../cache/response.models';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { hasNoValue, hasValue } from '../../shared/empty.util';
var DSOResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(DSOResponseParsingService, _super);
    function DSOResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = NormalizedObjectFactory;
        _this.toCache = true;
        return _this;
    }
    DSOResponseParsingService.prototype.parse = function (request, data) {
        var processRequestDTO;
        // Prevent empty pages returning an error, initialize empty array instead.
        if (hasValue(data.payload) && hasValue(data.payload.page) && data.payload.page.totalElements === 0) {
            processRequestDTO = { page: [] };
        }
        else {
            processRequestDTO = this.process(data.payload, request.uuid);
        }
        var objectList = processRequestDTO;
        if (hasNoValue(processRequestDTO)) {
            return new DSOSuccessResponse([], data.statusCode, data.statusText, undefined);
        }
        if (hasValue(processRequestDTO.page)) {
            objectList = processRequestDTO.page;
        }
        else if (!Array.isArray(processRequestDTO)) {
            objectList = [processRequestDTO];
        }
        var selfLinks = objectList.map(function (no) { return no.self; });
        return new DSOSuccessResponse(selfLinks, data.statusCode, data.statusText, this.processPageInfo(data.payload));
    };
    DSOResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], DSOResponseParsingService);
    return DSOResponseParsingService;
}(BaseResponseParsingService));
export { DSOResponseParsingService };
//# sourceMappingURL=dso-response-parsing.service.js.map
import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { ConfigSuccessResponse, ErrorResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { ConfigObjectFactory } from './models/config-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
var ConfigResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigResponseParsingService, _super);
    function ConfigResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = ConfigObjectFactory;
        _this.toCache = false;
        return _this;
    }
    ConfigResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === 201 || data.statusCode === 200)) {
            var configDefinition = this.process(data.payload, request.uuid);
            return new ConfigSuccessResponse(configDefinition, data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from config endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    ConfigResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], ConfigResponseParsingService);
    return ConfigResponseParsingService;
}(BaseResponseParsingService));
export { ConfigResponseParsingService };
//# sourceMappingURL=config-response-parsing.service.js.map
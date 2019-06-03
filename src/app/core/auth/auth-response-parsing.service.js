import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { AuthObjectFactory } from './auth-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { AuthStatusResponse } from '../cache/response.models';
import { GLOBAL_CONFIG } from '../../../config';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
var AuthResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(AuthResponseParsingService, _super);
    function AuthResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = AuthObjectFactory;
        _this.toCache = true;
        return _this;
    }
    AuthResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === 200)) {
            var response = this.process(data.payload, request.uuid);
            return new AuthStatusResponse(response, data.statusCode, data.statusText);
        }
        else {
            return new AuthStatusResponse(data.payload, data.statusCode, data.statusText);
        }
    };
    AuthResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], AuthResponseParsingService);
    return AuthResponseParsingService;
}(BaseResponseParsingService));
export { AuthResponseParsingService };
//# sourceMappingURL=auth-response-parsing.service.js.map
import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { ErrorResponse, IntegrationSuccessResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { IntegrationObjectFactory } from './integration-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IntegrationType } from './intergration-type';
import { AuthorityValue } from './models/authority.value';
var IntegrationResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(IntegrationResponseParsingService, _super);
    function IntegrationResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = IntegrationObjectFactory;
        _this.toCache = true;
        return _this;
    }
    IntegrationResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
            var dataDefinition = this.process(data.payload, request.uuid);
            return new IntegrationSuccessResponse(this.processResponse(dataDefinition), data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from Integration endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    IntegrationResponseParsingService.prototype.processResponse = function (data) {
        var returnList = Array.of();
        data.page.forEach(function (item, index) {
            if (item.type === IntegrationType.Authority) {
                data.page[index] = Object.assign(new AuthorityValue(), item);
            }
        });
        return data;
    };
    IntegrationResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], IntegrationResponseParsingService);
    return IntegrationResponseParsingService;
}(BaseResponseParsingService));
export { IntegrationResponseParsingService };
//# sourceMappingURL=integration-response-parsing.service.js.map
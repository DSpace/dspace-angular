import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
import { FilteredDiscoveryQueryResponse } from '../cache/response.models';
/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to a discovery query (string)
 * wrapped in a FilteredDiscoveryQueryResponse
 */
var FilteredDiscoveryPageResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(FilteredDiscoveryPageResponseParsingService, _super);
    function FilteredDiscoveryPageResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {};
        _this.toCache = false;
        return _this;
    }
    /**
     * Parses data from the REST API to a discovery query wrapped in a FilteredDiscoveryQueryResponse
     * @param {RestRequest} request
     * @param {DSpaceRESTV2Response} data
     * @returns {RestResponse}
     */
    FilteredDiscoveryPageResponseParsingService.prototype.parse = function (request, data) {
        var query = data.payload['discovery-query'];
        return new FilteredDiscoveryQueryResponse(query, data.statusCode, data.statusText);
    };
    FilteredDiscoveryPageResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], FilteredDiscoveryPageResponseParsingService);
    return FilteredDiscoveryPageResponseParsingService;
}(BaseResponseParsingService));
export { FilteredDiscoveryPageResponseParsingService };
//# sourceMappingURL=filtered-discovery-page-response-parsing.service.js.map
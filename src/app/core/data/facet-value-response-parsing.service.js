import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { FacetValueSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
var FacetValueResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(FacetValueResponseParsingService, _super);
    function FacetValueResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {};
        _this.toCache = false;
        return _this;
    }
    FacetValueResponseParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var serializer = new DSpaceRESTv2Serializer(FacetValue);
        // const values = payload._embedded.values.map((value) => {value.search = value._links.search.href; return value;});
        var facetValues = serializer.deserializeArray(payload._embedded.values);
        return new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, this.processPageInfo(data.payload));
    };
    FacetValueResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], FacetValueResponseParsingService);
    return FacetValueResponseParsingService;
}(BaseResponseParsingService));
export { FacetValueResponseParsingService };
//# sourceMappingURL=facet-value-response-parsing.service.js.map
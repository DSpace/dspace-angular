import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { FacetValueMap, FacetValueMapSuccessResponse, FacetValueSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
var FacetValueMapResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(FacetValueMapResponseParsingService, _super);
    function FacetValueMapResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {};
        _this.toCache = false;
        return _this;
    }
    FacetValueMapResponseParsingService.prototype.parse = function (request, data) {
        var _this = this;
        var payload = data.payload;
        var facetMap = new FacetValueMap();
        var serializer = new DSpaceRESTv2Serializer(FacetValue);
        payload._embedded.facets.map(function (facet) {
            var values = facet._embedded.values.map(function (value) { value.search = value._links.search.href; return value; });
            var facetValues = serializer.deserializeArray(values);
            var valuesResponse = new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, _this.processPageInfo(data.payload));
            facetMap[facet.name] = valuesResponse;
        });
        return new FacetValueMapSuccessResponse(facetMap, data.statusCode, data.statusText);
    };
    FacetValueMapResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], FacetValueMapResponseParsingService);
    return FacetValueMapResponseParsingService;
}(BaseResponseParsingService));
export { FacetValueMapResponseParsingService };
//# sourceMappingURL=facet-value-map-response-parsing.service.js.map
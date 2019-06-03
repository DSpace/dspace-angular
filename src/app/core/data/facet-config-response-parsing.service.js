import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { FacetConfigSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
var FacetConfigResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(FacetConfigResponseParsingService, _super);
    function FacetConfigResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {};
        _this.toCache = false;
        return _this;
    }
    FacetConfigResponseParsingService.prototype.parse = function (request, data) {
        var config = data.payload._embedded.facets;
        var serializer = new DSpaceRESTv2Serializer(SearchFilterConfig);
        var facetConfig = serializer.deserializeArray(config);
        return new FacetConfigSuccessResponse(facetConfig, data.statusCode, data.statusText);
    };
    FacetConfigResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], FacetConfigResponseParsingService);
    return FacetConfigResponseParsingService;
}(BaseResponseParsingService));
export { FacetConfigResponseParsingService };
//# sourceMappingURL=facet-config-response-parsing.service.js.map
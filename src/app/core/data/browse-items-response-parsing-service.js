import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, GenericSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to Browse Items (DSpaceObject[])
 */
var BrowseItemsResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseItemsResponseParsingService, _super);
    function BrowseItemsResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {
            getConstructor: function () { return DSpaceObject; }
        };
        _this.toCache = false;
        return _this;
    }
    /**
     * Parses data from the browse endpoint to a list of DSpaceObjects
     * @param {RestRequest} request
     * @param {DSpaceRESTV2Response} data
     * @returns {RestResponse}
     */
    BrowseItemsResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._embedded)
            && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
            var serializer = new DSpaceRESTv2Serializer(NormalizedDSpaceObject);
            var items = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
            return new GenericSuccessResponse(items, data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else if (hasValue(data.payload) && hasValue(data.payload.page)) {
            return new GenericSuccessResponse([], data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from browse endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    BrowseItemsResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], BrowseItemsResponseParsingService);
    return BrowseItemsResponseParsingService;
}(BaseResponseParsingService));
export { BrowseItemsResponseParsingService };
//# sourceMappingURL=browse-items-response-parsing-service.js.map
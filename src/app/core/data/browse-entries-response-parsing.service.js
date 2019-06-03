import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, GenericSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { BrowseEntry } from '../shared/browse-entry.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
var BrowseEntriesResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseEntriesResponseParsingService, _super);
    function BrowseEntriesResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = {
            getConstructor: function () { return BrowseEntry; }
        };
        _this.toCache = false;
        return _this;
    }
    BrowseEntriesResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload)) {
            var browseEntries = [];
            if (isNotEmpty(data.payload._embedded) && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
                var serializer = new DSpaceRESTv2Serializer(BrowseEntry);
                browseEntries = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
            }
            return new GenericSuccessResponse(browseEntries, data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from browse endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    BrowseEntriesResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], BrowseEntriesResponseParsingService);
    return BrowseEntriesResponseParsingService;
}(BaseResponseParsingService));
export { BrowseEntriesResponseParsingService };
//# sourceMappingURL=browse-entries-response-parsing.service.js.map
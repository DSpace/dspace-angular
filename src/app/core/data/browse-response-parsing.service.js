import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { GenericSuccessResponse, ErrorResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { BrowseDefinition } from '../shared/browse-definition.model';
var BrowseResponseParsingService = /** @class */ (function () {
    function BrowseResponseParsingService() {
    }
    BrowseResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload) && isNotEmpty(data.payload._embedded)
            && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
            var serializer = new DSpaceRESTv2Serializer(BrowseDefinition);
            var browseDefinitions = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
            return new GenericSuccessResponse(browseDefinitions, data.statusCode, data.statusText);
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from browse endpoint'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    BrowseResponseParsingService = tslib_1.__decorate([
        Injectable()
    ], BrowseResponseParsingService);
    return BrowseResponseParsingService;
}());
export { BrowseResponseParsingService };
//# sourceMappingURL=browse-response-parsing.service.js.map
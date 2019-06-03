import * as tslib_1 from "tslib";
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { Injectable } from '@angular/core';
import { MetadatafieldSuccessResponse } from '../cache/response.models';
import { MetadataField } from '../metadata/metadatafield.model';
/**
 * A service responsible for parsing DSpaceRESTV2Response data related to a single MetadataField to a valid RestResponse
 */
var MetadatafieldParsingService = /** @class */ (function () {
    function MetadatafieldParsingService() {
    }
    MetadatafieldParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var deserialized = new DSpaceRESTv2Serializer(MetadataField).deserialize(payload);
        return new MetadatafieldSuccessResponse(deserialized, data.statusCode, data.statusText);
    };
    MetadatafieldParsingService = tslib_1.__decorate([
        Injectable()
    ], MetadatafieldParsingService);
    return MetadatafieldParsingService;
}());
export { MetadatafieldParsingService };
//# sourceMappingURL=metadatafield-parsing.service.js.map
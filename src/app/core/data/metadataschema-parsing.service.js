import * as tslib_1 from "tslib";
import { MetadataSchema } from '../metadata/metadataschema.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { Injectable } from '@angular/core';
import { MetadataschemaSuccessResponse } from '../cache/response.models';
var MetadataschemaParsingService = /** @class */ (function () {
    function MetadataschemaParsingService() {
    }
    MetadataschemaParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var deserialized = new DSpaceRESTv2Serializer(MetadataSchema).deserialize(payload);
        return new MetadataschemaSuccessResponse(deserialized, data.statusCode, data.statusText);
    };
    MetadataschemaParsingService = tslib_1.__decorate([
        Injectable()
    ], MetadataschemaParsingService);
    return MetadataschemaParsingService;
}());
export { MetadataschemaParsingService };
//# sourceMappingURL=metadataschema-parsing.service.js.map
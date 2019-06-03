import * as tslib_1 from "tslib";
import { RegistryMetadataschemasSuccessResponse } from '../cache/response.models';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
var RegistryMetadataschemasResponseParsingService = /** @class */ (function () {
    function RegistryMetadataschemasResponseParsingService(dsoParser) {
        this.dsoParser = dsoParser;
    }
    RegistryMetadataschemasResponseParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var metadataschemas = [];
        if (hasValue(payload._embedded)) {
            metadataschemas = payload._embedded.metadataschemas;
        }
        payload.metadataschemas = metadataschemas;
        var deserialized = new DSpaceRESTv2Serializer(RegistryMetadataschemasResponse).deserialize(payload);
        return new RegistryMetadataschemasSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload));
    };
    RegistryMetadataschemasResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOResponseParsingService])
    ], RegistryMetadataschemasResponseParsingService);
    return RegistryMetadataschemasResponseParsingService;
}());
export { RegistryMetadataschemasResponseParsingService };
//# sourceMappingURL=registry-metadataschemas-response-parsing.service.js.map
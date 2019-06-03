import * as tslib_1 from "tslib";
import { RegistryMetadatafieldsSuccessResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { Injectable } from '@angular/core';
import { RegistryMetadatafieldsResponse } from '../registry/registry-metadatafields-response.model';
import { hasValue } from '../../shared/empty.util';
var RegistryMetadatafieldsResponseParsingService = /** @class */ (function () {
    function RegistryMetadatafieldsResponseParsingService(dsoParser) {
        this.dsoParser = dsoParser;
    }
    RegistryMetadatafieldsResponseParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var metadatafields = [];
        if (hasValue(payload._embedded)) {
            metadatafields = payload._embedded.metadatafields;
            metadatafields.forEach(function (field) {
                field.schema = field._embedded.schema;
            });
        }
        payload.metadatafields = metadatafields;
        var deserialized = new DSpaceRESTv2Serializer(RegistryMetadatafieldsResponse).deserialize(payload);
        return new RegistryMetadatafieldsSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload));
    };
    RegistryMetadatafieldsResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOResponseParsingService])
    ], RegistryMetadatafieldsResponseParsingService);
    return RegistryMetadatafieldsResponseParsingService;
}());
export { RegistryMetadatafieldsResponseParsingService };
//# sourceMappingURL=registry-metadatafields-response-parsing.service.js.map
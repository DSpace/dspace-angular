import * as tslib_1 from "tslib";
import { RegistryBitstreamformatsSuccessResponse } from '../cache/response.models';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { Injectable } from '@angular/core';
var RegistryBitstreamformatsResponseParsingService = /** @class */ (function () {
    function RegistryBitstreamformatsResponseParsingService(dsoParser) {
        this.dsoParser = dsoParser;
    }
    RegistryBitstreamformatsResponseParsingService.prototype.parse = function (request, data) {
        var payload = data.payload;
        var bitstreamformats = payload._embedded.bitstreamformats;
        payload.bitstreamformats = bitstreamformats;
        var deserialized = new DSpaceRESTv2Serializer(RegistryBitstreamformatsResponse).deserialize(payload);
        return new RegistryBitstreamformatsSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload.page));
    };
    RegistryBitstreamformatsResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOResponseParsingService])
    ], RegistryBitstreamformatsResponseParsingService);
    return RegistryBitstreamformatsResponseParsingService;
}());
export { RegistryBitstreamformatsResponseParsingService };
//# sourceMappingURL=registry-bitstreamformats-response-parsing.service.js.map
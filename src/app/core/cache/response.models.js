import * as tslib_1 from "tslib";
/* tslint:disable:max-classes-per-file */
var RestResponse = /** @class */ (function () {
    function RestResponse(isSuccessful, statusCode, statusText) {
        this.isSuccessful = isSuccessful;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.toCache = true;
    }
    return RestResponse;
}());
export { RestResponse };
var DSOSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(DSOSuccessResponse, _super);
    function DSOSuccessResponse(resourceSelfLinks, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.resourceSelfLinks = resourceSelfLinks;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return DSOSuccessResponse;
}(RestResponse));
export { DSOSuccessResponse };
/**
 * A successful response containing a list of MetadataSchemas wrapped in a RegistryMetadataschemasResponse
 */
var RegistryMetadataschemasSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryMetadataschemasSuccessResponse, _super);
    function RegistryMetadataschemasSuccessResponse(metadataschemasResponse, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.metadataschemasResponse = metadataschemasResponse;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return RegistryMetadataschemasSuccessResponse;
}(RestResponse));
export { RegistryMetadataschemasSuccessResponse };
/**
 * A successful response containing a list of MetadataFields wrapped in a RegistryMetadatafieldsResponse
 */
var RegistryMetadatafieldsSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryMetadatafieldsSuccessResponse, _super);
    function RegistryMetadatafieldsSuccessResponse(metadatafieldsResponse, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.metadatafieldsResponse = metadatafieldsResponse;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return RegistryMetadatafieldsSuccessResponse;
}(RestResponse));
export { RegistryMetadatafieldsSuccessResponse };
/**
 * A successful response containing a list of BitstreamFormats wrapped in a RegistryBitstreamformatsResponse
 */
var RegistryBitstreamformatsSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryBitstreamformatsSuccessResponse, _super);
    function RegistryBitstreamformatsSuccessResponse(bitstreamformatsResponse, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.bitstreamformatsResponse = bitstreamformatsResponse;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return RegistryBitstreamformatsSuccessResponse;
}(RestResponse));
export { RegistryBitstreamformatsSuccessResponse };
/**
 * A successful response containing exactly one MetadataSchema
 */
var MetadataschemaSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataschemaSuccessResponse, _super);
    function MetadataschemaSuccessResponse(metadataschema, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.metadataschema = metadataschema;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return MetadataschemaSuccessResponse;
}(RestResponse));
export { MetadataschemaSuccessResponse };
/**
 * A successful response containing exactly one MetadataField
 */
var MetadatafieldSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(MetadatafieldSuccessResponse, _super);
    function MetadatafieldSuccessResponse(metadatafield, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.metadatafield = metadatafield;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return MetadatafieldSuccessResponse;
}(RestResponse));
export { MetadatafieldSuccessResponse };
var SearchSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(SearchSuccessResponse, _super);
    function SearchSuccessResponse(results, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.results = results;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return SearchSuccessResponse;
}(RestResponse));
export { SearchSuccessResponse };
var FacetConfigSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(FacetConfigSuccessResponse, _super);
    function FacetConfigSuccessResponse(results, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.results = results;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return FacetConfigSuccessResponse;
}(RestResponse));
export { FacetConfigSuccessResponse };
var FacetValueMap = /** @class */ (function () {
    function FacetValueMap() {
    }
    return FacetValueMap;
}());
export { FacetValueMap };
var FacetValueSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(FacetValueSuccessResponse, _super);
    function FacetValueSuccessResponse(results, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.results = results;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return FacetValueSuccessResponse;
}(RestResponse));
export { FacetValueSuccessResponse };
var FacetValueMapSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(FacetValueMapSuccessResponse, _super);
    function FacetValueMapSuccessResponse(results, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.results = results;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return FacetValueMapSuccessResponse;
}(RestResponse));
export { FacetValueMapSuccessResponse };
var EndpointMap = /** @class */ (function () {
    function EndpointMap() {
    }
    return EndpointMap;
}());
export { EndpointMap };
var EndpointMapSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(EndpointMapSuccessResponse, _super);
    function EndpointMapSuccessResponse(endpointMap, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.endpointMap = endpointMap;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return EndpointMapSuccessResponse;
}(RestResponse));
export { EndpointMapSuccessResponse };
var GenericSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(GenericSuccessResponse, _super);
    function GenericSuccessResponse(payload, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.payload = payload;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return GenericSuccessResponse;
}(RestResponse));
export { GenericSuccessResponse };
var ErrorResponse = /** @class */ (function (_super) {
    tslib_1.__extends(ErrorResponse, _super);
    function ErrorResponse(error) {
        var _this = _super.call(this, false, error.statusCode, error.statusText) || this;
        console.error(error);
        _this.errorMessage = error.message;
        return _this;
    }
    return ErrorResponse;
}(RestResponse));
export { ErrorResponse };
var ConfigSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigSuccessResponse, _super);
    function ConfigSuccessResponse(configDefinition, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.configDefinition = configDefinition;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return ConfigSuccessResponse;
}(RestResponse));
export { ConfigSuccessResponse };
var AuthStatusResponse = /** @class */ (function (_super) {
    tslib_1.__extends(AuthStatusResponse, _super);
    function AuthStatusResponse(response, statusCode, statusText) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.response = response;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.toCache = false;
        return _this;
    }
    return AuthStatusResponse;
}(RestResponse));
export { AuthStatusResponse };
var IntegrationSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(IntegrationSuccessResponse, _super);
    function IntegrationSuccessResponse(dataDefinition, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.dataDefinition = dataDefinition;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return IntegrationSuccessResponse;
}(RestResponse));
export { IntegrationSuccessResponse };
var PostPatchSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(PostPatchSuccessResponse, _super);
    function PostPatchSuccessResponse(dataDefinition, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.dataDefinition = dataDefinition;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return PostPatchSuccessResponse;
}(RestResponse));
export { PostPatchSuccessResponse };
var SubmissionSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionSuccessResponse, _super);
    function SubmissionSuccessResponse(dataDefinition, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.dataDefinition = dataDefinition;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return SubmissionSuccessResponse;
}(RestResponse));
export { SubmissionSuccessResponse };
var EpersonSuccessResponse = /** @class */ (function (_super) {
    tslib_1.__extends(EpersonSuccessResponse, _super);
    function EpersonSuccessResponse(epersonDefinition, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.epersonDefinition = epersonDefinition;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return EpersonSuccessResponse;
}(RestResponse));
export { EpersonSuccessResponse };
var MessageResponse = /** @class */ (function (_super) {
    tslib_1.__extends(MessageResponse, _super);
    function MessageResponse(statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        _this.toCache = false;
        return _this;
    }
    return MessageResponse;
}(RestResponse));
export { MessageResponse };
var TaskResponse = /** @class */ (function (_super) {
    tslib_1.__extends(TaskResponse, _super);
    function TaskResponse(statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        _this.toCache = false;
        return _this;
    }
    return TaskResponse;
}(RestResponse));
export { TaskResponse };
var FilteredDiscoveryQueryResponse = /** @class */ (function (_super) {
    tslib_1.__extends(FilteredDiscoveryQueryResponse, _super);
    function FilteredDiscoveryQueryResponse(filterQuery, statusCode, statusText, pageInfo) {
        var _this = _super.call(this, true, statusCode, statusText) || this;
        _this.filterQuery = filterQuery;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        _this.pageInfo = pageInfo;
        return _this;
    }
    return FilteredDiscoveryQueryResponse;
}(RestResponse));
export { FilteredDiscoveryQueryResponse };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=response.models.js.map
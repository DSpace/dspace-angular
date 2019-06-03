import * as tslib_1 from "tslib";
import { BrowseEntriesResponseParsingService } from './browse-entries-response-parsing.service';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { EndpointMapResponseParsingService } from './endpoint-map-response-parsing.service';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { ConfigResponseParsingService } from '../config/config-response-parsing.service';
import { AuthResponseParsingService } from '../auth/auth-response-parsing.service';
import { SubmissionResponseParsingService } from '../submission/submission-response-parsing.service';
import { IntegrationResponseParsingService } from '../integration/integration-response-parsing.service';
import { RestRequestMethod } from './rest-request-method';
import { EpersonResponseParsingService } from '../eperson/eperson-response-parsing.service';
import { BrowseItemsResponseParsingService } from './browse-items-response-parsing-service';
import { MetadataschemaParsingService } from './metadataschema-parsing.service';
import { MetadatafieldParsingService } from './metadatafield-parsing.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { TaskResponseParsingService } from '../tasks/task-response-parsing.service';
/* tslint:disable:max-classes-per-file */
var RestRequest = /** @class */ (function () {
    function RestRequest(uuid, href, method, body, options) {
        if (method === void 0) { method = RestRequestMethod.GET; }
        this.uuid = uuid;
        this.href = href;
        this.method = method;
        this.body = body;
        this.options = options;
        this.responseMsToLive = 0;
    }
    RestRequest.prototype.getResponseParser = function () {
        return DSOResponseParsingService;
    };
    Object.defineProperty(RestRequest.prototype, "toCache", {
        get: function () {
            return this.responseMsToLive > 0;
        },
        enumerable: true,
        configurable: true
    });
    return RestRequest;
}());
export { RestRequest };
var GetRequest = /** @class */ (function (_super) {
    tslib_1.__extends(GetRequest, _super);
    function GetRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.GET, body, options) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        _this.responseMsToLive = 60 * 15 * 1000;
        return _this;
    }
    return GetRequest;
}(RestRequest));
export { GetRequest };
var PostRequest = /** @class */ (function (_super) {
    tslib_1.__extends(PostRequest, _super);
    function PostRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.POST, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return PostRequest;
}(RestRequest));
export { PostRequest };
var PutRequest = /** @class */ (function (_super) {
    tslib_1.__extends(PutRequest, _super);
    function PutRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.PUT, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return PutRequest;
}(RestRequest));
export { PutRequest };
var DeleteRequest = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteRequest, _super);
    function DeleteRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.DELETE, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return DeleteRequest;
}(RestRequest));
export { DeleteRequest };
var OptionsRequest = /** @class */ (function (_super) {
    tslib_1.__extends(OptionsRequest, _super);
    function OptionsRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.OPTIONS, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return OptionsRequest;
}(RestRequest));
export { OptionsRequest };
var HeadRequest = /** @class */ (function (_super) {
    tslib_1.__extends(HeadRequest, _super);
    function HeadRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.HEAD, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return HeadRequest;
}(RestRequest));
export { HeadRequest };
var PatchRequest = /** @class */ (function (_super) {
    tslib_1.__extends(PatchRequest, _super);
    function PatchRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, RestRequestMethod.PATCH, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    return PatchRequest;
}(RestRequest));
export { PatchRequest };
var FindByIDRequest = /** @class */ (function (_super) {
    tslib_1.__extends(FindByIDRequest, _super);
    function FindByIDRequest(uuid, href, resourceID) {
        var _this = _super.call(this, uuid, href) || this;
        _this.resourceID = resourceID;
        return _this;
    }
    return FindByIDRequest;
}(GetRequest));
export { FindByIDRequest };
var FindAllOptions = /** @class */ (function () {
    function FindAllOptions() {
    }
    return FindAllOptions;
}());
export { FindAllOptions };
var FindAllRequest = /** @class */ (function (_super) {
    tslib_1.__extends(FindAllRequest, _super);
    function FindAllRequest(uuid, href, body) {
        var _this = _super.call(this, uuid, href) || this;
        _this.body = body;
        return _this;
    }
    return FindAllRequest;
}(GetRequest));
export { FindAllRequest };
var EndpointMapRequest = /** @class */ (function (_super) {
    tslib_1.__extends(EndpointMapRequest, _super);
    function EndpointMapRequest(uuid, href, body) {
        return _super.call(this, uuid, new URLCombiner(href, '?endpointMap').toString(), body) || this;
    }
    EndpointMapRequest.prototype.getResponseParser = function () {
        return EndpointMapResponseParsingService;
    };
    return EndpointMapRequest;
}(GetRequest));
export { EndpointMapRequest };
var BrowseEndpointRequest = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseEndpointRequest, _super);
    function BrowseEndpointRequest(uuid, href) {
        return _super.call(this, uuid, href) || this;
    }
    BrowseEndpointRequest.prototype.getResponseParser = function () {
        return BrowseResponseParsingService;
    };
    return BrowseEndpointRequest;
}(GetRequest));
export { BrowseEndpointRequest };
var BrowseEntriesRequest = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseEntriesRequest, _super);
    function BrowseEntriesRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowseEntriesRequest.prototype.getResponseParser = function () {
        return BrowseEntriesResponseParsingService;
    };
    return BrowseEntriesRequest;
}(GetRequest));
export { BrowseEntriesRequest };
var BrowseItemsRequest = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseItemsRequest, _super);
    function BrowseItemsRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowseItemsRequest.prototype.getResponseParser = function () {
        return BrowseItemsResponseParsingService;
    };
    return BrowseItemsRequest;
}(GetRequest));
export { BrowseItemsRequest };
var ConfigRequest = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigRequest, _super);
    function ConfigRequest(uuid, href, options) {
        var _this = _super.call(this, uuid, href, null, options) || this;
        _this.options = options;
        return _this;
    }
    ConfigRequest.prototype.getResponseParser = function () {
        return ConfigResponseParsingService;
    };
    return ConfigRequest;
}(GetRequest));
export { ConfigRequest };
var AuthPostRequest = /** @class */ (function (_super) {
    tslib_1.__extends(AuthPostRequest, _super);
    function AuthPostRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    AuthPostRequest.prototype.getResponseParser = function () {
        return AuthResponseParsingService;
    };
    return AuthPostRequest;
}(PostRequest));
export { AuthPostRequest };
var AuthGetRequest = /** @class */ (function (_super) {
    tslib_1.__extends(AuthGetRequest, _super);
    function AuthGetRequest(uuid, href, options) {
        var _this = _super.call(this, uuid, href, null, options) || this;
        _this.options = options;
        return _this;
    }
    AuthGetRequest.prototype.getResponseParser = function () {
        return AuthResponseParsingService;
    };
    return AuthGetRequest;
}(GetRequest));
export { AuthGetRequest };
var IntegrationRequest = /** @class */ (function (_super) {
    tslib_1.__extends(IntegrationRequest, _super);
    function IntegrationRequest(uuid, href) {
        return _super.call(this, uuid, href) || this;
    }
    IntegrationRequest.prototype.getResponseParser = function () {
        return IntegrationResponseParsingService;
    };
    return IntegrationRequest;
}(GetRequest));
export { IntegrationRequest };
/**
 * Request to create a MetadataSchema
 */
var CreateMetadataSchemaRequest = /** @class */ (function (_super) {
    tslib_1.__extends(CreateMetadataSchemaRequest, _super);
    function CreateMetadataSchemaRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    CreateMetadataSchemaRequest.prototype.getResponseParser = function () {
        return MetadataschemaParsingService;
    };
    return CreateMetadataSchemaRequest;
}(PostRequest));
export { CreateMetadataSchemaRequest };
/**
 * Request to update a MetadataSchema
 */
var UpdateMetadataSchemaRequest = /** @class */ (function (_super) {
    tslib_1.__extends(UpdateMetadataSchemaRequest, _super);
    function UpdateMetadataSchemaRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    UpdateMetadataSchemaRequest.prototype.getResponseParser = function () {
        return MetadataschemaParsingService;
    };
    return UpdateMetadataSchemaRequest;
}(PutRequest));
export { UpdateMetadataSchemaRequest };
/**
 * Request to create a MetadataField
 */
var CreateMetadataFieldRequest = /** @class */ (function (_super) {
    tslib_1.__extends(CreateMetadataFieldRequest, _super);
    function CreateMetadataFieldRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    CreateMetadataFieldRequest.prototype.getResponseParser = function () {
        return MetadatafieldParsingService;
    };
    return CreateMetadataFieldRequest;
}(PostRequest));
export { CreateMetadataFieldRequest };
/**
 * Request to update a MetadataField
 */
var UpdateMetadataFieldRequest = /** @class */ (function (_super) {
    tslib_1.__extends(UpdateMetadataFieldRequest, _super);
    function UpdateMetadataFieldRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    UpdateMetadataFieldRequest.prototype.getResponseParser = function () {
        return MetadatafieldParsingService;
    };
    return UpdateMetadataFieldRequest;
}(PutRequest));
export { UpdateMetadataFieldRequest };
/**
 * Class representing a submission HTTP GET request object
 */
var SubmissionRequest = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionRequest, _super);
    function SubmissionRequest(uuid, href) {
        return _super.call(this, uuid, href) || this;
    }
    SubmissionRequest.prototype.getResponseParser = function () {
        return SubmissionResponseParsingService;
    };
    return SubmissionRequest;
}(GetRequest));
export { SubmissionRequest };
/**
 * Class representing a submission HTTP DELETE request object
 */
var SubmissionDeleteRequest = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionDeleteRequest, _super);
    function SubmissionDeleteRequest(uuid, href) {
        var _this = _super.call(this, uuid, href) || this;
        _this.uuid = uuid;
        _this.href = href;
        return _this;
    }
    SubmissionDeleteRequest.prototype.getResponseParser = function () {
        return SubmissionResponseParsingService;
    };
    return SubmissionDeleteRequest;
}(DeleteRequest));
export { SubmissionDeleteRequest };
/**
 * Class representing a submission HTTP PATCH request object
 */
var SubmissionPatchRequest = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionPatchRequest, _super);
    function SubmissionPatchRequest(uuid, href, body) {
        var _this = _super.call(this, uuid, href, body) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        return _this;
    }
    SubmissionPatchRequest.prototype.getResponseParser = function () {
        return SubmissionResponseParsingService;
    };
    return SubmissionPatchRequest;
}(PatchRequest));
export { SubmissionPatchRequest };
/**
 * Class representing a submission HTTP POST request object
 */
var SubmissionPostRequest = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionPostRequest, _super);
    function SubmissionPostRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.uuid = uuid;
        _this.href = href;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    SubmissionPostRequest.prototype.getResponseParser = function () {
        return SubmissionResponseParsingService;
    };
    return SubmissionPostRequest;
}(PostRequest));
export { SubmissionPostRequest };
/**
 * Class representing an eperson HTTP GET request object
 */
var EpersonRequest = /** @class */ (function (_super) {
    tslib_1.__extends(EpersonRequest, _super);
    function EpersonRequest(uuid, href) {
        return _super.call(this, uuid, href) || this;
    }
    EpersonRequest.prototype.getResponseParser = function () {
        return EpersonResponseParsingService;
    };
    return EpersonRequest;
}(GetRequest));
export { EpersonRequest };
var CreateRequest = /** @class */ (function (_super) {
    tslib_1.__extends(CreateRequest, _super);
    function CreateRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    CreateRequest.prototype.getResponseParser = function () {
        return DSOResponseParsingService;
    };
    return CreateRequest;
}(PostRequest));
export { CreateRequest };
/**
 * Request to delete an object based on its identifier
 */
var DeleteByIDRequest = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteByIDRequest, _super);
    function DeleteByIDRequest(uuid, href, resourceID) {
        var _this = _super.call(this, uuid, href) || this;
        _this.resourceID = resourceID;
        return _this;
    }
    return DeleteByIDRequest;
}(DeleteRequest));
export { DeleteByIDRequest };
var TaskPostRequest = /** @class */ (function (_super) {
    tslib_1.__extends(TaskPostRequest, _super);
    function TaskPostRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    TaskPostRequest.prototype.getResponseParser = function () {
        return TaskResponseParsingService;
    };
    return TaskPostRequest;
}(PostRequest));
export { TaskPostRequest };
var TaskDeleteRequest = /** @class */ (function (_super) {
    tslib_1.__extends(TaskDeleteRequest, _super);
    function TaskDeleteRequest(uuid, href, body, options) {
        var _this = _super.call(this, uuid, href, body, options) || this;
        _this.body = body;
        _this.options = options;
        return _this;
    }
    TaskDeleteRequest.prototype.getResponseParser = function () {
        return TaskResponseParsingService;
    };
    return TaskDeleteRequest;
}(DeleteRequest));
export { TaskDeleteRequest };
var MyDSpaceRequest = /** @class */ (function (_super) {
    tslib_1.__extends(MyDSpaceRequest, _super);
    function MyDSpaceRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.responseMsToLive = 0;
        return _this;
    }
    return MyDSpaceRequest;
}(GetRequest));
export { MyDSpaceRequest };
var RequestError = /** @class */ (function (_super) {
    tslib_1.__extends(RequestError, _super);
    function RequestError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RequestError;
}(Error));
export { RequestError };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=request.models.js.map
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
/**
 * Provides methods to retrieve, from REST server, bitstream access conditions configurations applicable during the submission process.
 */
var SubmissionUploadsConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionUploadsConfigService, _super);
    function SubmissionUploadsConfigService(objectCache, requestService, halService) {
        var _this = _super.call(this) || this;
        _this.objectCache = objectCache;
        _this.requestService = requestService;
        _this.halService = halService;
        _this.linkPath = 'submissionuploads';
        _this.browseEndpoint = '';
        return _this;
    }
    SubmissionUploadsConfigService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ObjectCacheService,
            RequestService,
            HALEndpointService])
    ], SubmissionUploadsConfigService);
    return SubmissionUploadsConfigService;
}(ConfigService));
export { SubmissionUploadsConfigService };
//# sourceMappingURL=submission-uploads-config.service.js.map
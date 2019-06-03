import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
var SubmissionDefinitionsConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionDefinitionsConfigService, _super);
    function SubmissionDefinitionsConfigService(requestService, halService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.halService = halService;
        _this.linkPath = 'submissiondefinitions';
        _this.browseEndpoint = 'search/findByCollection';
        return _this;
    }
    SubmissionDefinitionsConfigService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            HALEndpointService])
    ], SubmissionDefinitionsConfigService);
    return SubmissionDefinitionsConfigService;
}(ConfigService));
export { SubmissionDefinitionsConfigService };
//# sourceMappingURL=submission-definitions-config.service.js.map
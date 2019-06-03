import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
var SubmissionFormsConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionFormsConfigService, _super);
    function SubmissionFormsConfigService(requestService, halService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.halService = halService;
        _this.linkPath = 'submissionforms';
        _this.browseEndpoint = '';
        return _this;
    }
    SubmissionFormsConfigService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            HALEndpointService])
    ], SubmissionFormsConfigService);
    return SubmissionFormsConfigService;
}(ConfigService));
export { SubmissionFormsConfigService };
//# sourceMappingURL=submission-forms-config.service.js.map
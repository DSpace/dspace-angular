import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { RequestService } from '../data/request.service';
import { IntegrationService } from './integration.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
var AuthorityService = /** @class */ (function (_super) {
    tslib_1.__extends(AuthorityService, _super);
    function AuthorityService(requestService, rdbService, halService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.halService = halService;
        _this.linkPath = 'authorities';
        _this.entriesEndpoint = 'entries';
        _this.entryValueEndpoint = 'entryValues';
        return _this;
    }
    AuthorityService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            HALEndpointService])
    ], AuthorityService);
    return AuthorityService;
}(IntegrationService));
export { AuthorityService };
//# sourceMappingURL=authority.service.js.map
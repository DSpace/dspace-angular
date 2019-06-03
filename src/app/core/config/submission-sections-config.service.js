import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
var SubmissionSectionsConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionSectionsConfigService, _super);
    function SubmissionSectionsConfigService(requestService, halService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.halService = halService;
        _this.linkPath = 'submissionsections';
        _this.browseEndpoint = '';
        return _this;
    }
    SubmissionSectionsConfigService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            HALEndpointService])
    ], SubmissionSectionsConfigService);
    return SubmissionSectionsConfigService;
}(ConfigService));
export { SubmissionSectionsConfigService };
//# sourceMappingURL=submission-sections-config.service.js.map
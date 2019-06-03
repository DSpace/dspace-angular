import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { JsonPatchOperationsService } from '../json-patch/json-patch-operations.service';
import { SubmissionPatchRequest } from '../data/request.models';
/**
 * A service that provides methods to make JSON Patch requests.
 */
var SubmissionJsonPatchOperationsService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionJsonPatchOperationsService, _super);
    function SubmissionJsonPatchOperationsService(requestService, store, halService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.store = store;
        _this.halService = halService;
        _this.linkPath = '';
        _this.patchRequestConstructor = SubmissionPatchRequest;
        return _this;
    }
    SubmissionJsonPatchOperationsService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            Store,
            HALEndpointService])
    ], SubmissionJsonPatchOperationsService);
    return SubmissionJsonPatchOperationsService;
}(JsonPatchOperationsService));
export { SubmissionJsonPatchOperationsService };
//# sourceMappingURL=submission-json-patch-operations.service.js.map
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { SubmissionService } from './submission.service';
/**
 * Instance of SubmissionService used on SSR.
 */
var ServerSubmissionService = /** @class */ (function (_super) {
    tslib_1.__extends(ServerSubmissionService, _super);
    function ServerSubmissionService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Override createSubmission parent method to return an empty observable
     *
     * @return Observable<SubmissionObject>
     *    observable of SubmissionObject
     */
    ServerSubmissionService.prototype.createSubmission = function () {
        return observableOf(null);
    };
    /**
     * Override retrieveSubmission parent method to return an empty observable
     *
     * @return Observable<SubmissionObject>
     *    observable of SubmissionObject
     */
    ServerSubmissionService.prototype.retrieveSubmission = function (submissionId) {
        return observableOf(null);
    };
    /**
     * Override startAutoSave parent method and return without doing anything
     *
     * @param submissionId
     *    The submission id
     */
    ServerSubmissionService.prototype.startAutoSave = function (submissionId) {
        return;
    };
    /**
     * Override startAutoSave parent method and return without doing anything
     */
    ServerSubmissionService.prototype.stopAutoSave = function () {
        return;
    };
    ServerSubmissionService = tslib_1.__decorate([
        Injectable()
    ], ServerSubmissionService);
    return ServerSubmissionService;
}(SubmissionService));
export { ServerSubmissionService };
//# sourceMappingURL=server-submission.service.js.map
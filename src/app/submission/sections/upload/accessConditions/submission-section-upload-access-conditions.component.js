import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { find } from 'rxjs/operators';
import { GroupEpersonService } from '../../../../core/eperson/group-eperson.service';
import { isEmpty } from '../../../../shared/empty.util';
/**
 * This component represents a badge that describe an access condition
 */
var SubmissionSectionUploadAccessConditionsComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {GroupEpersonService} groupService
     */
    function SubmissionSectionUploadAccessConditionsComponent(groupService) {
        this.groupService = groupService;
        /**
         * The list of access conditions
         * @type {Array}
         */
        this.accessConditionsList = [];
    }
    /**
     * Retrieve access conditions list
     */
    SubmissionSectionUploadAccessConditionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.accessConditions.forEach(function (accessCondition) {
            if (isEmpty(accessCondition.name)) {
                _this.groupService.findById(accessCondition.groupUUID).pipe(find(function (rd) { return !rd.isResponsePending && rd.hasSucceeded; }))
                    .subscribe(function (rd) {
                    var group = rd.payload;
                    var accessConditionEntry = Object.assign({}, accessCondition);
                    accessConditionEntry.name = group.name;
                    _this.accessConditionsList.push(accessConditionEntry);
                });
            }
            else {
                _this.accessConditionsList.push(accessCondition);
            }
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SubmissionSectionUploadAccessConditionsComponent.prototype, "accessConditions", void 0);
    SubmissionSectionUploadAccessConditionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-upload-access-conditions',
            templateUrl: './submission-section-upload-access-conditions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [GroupEpersonService])
    ], SubmissionSectionUploadAccessConditionsComponent);
    return SubmissionSectionUploadAccessConditionsComponent;
}());
export { SubmissionSectionUploadAccessConditionsComponent };
//# sourceMappingURL=submission-section-upload-access-conditions.component.js.map
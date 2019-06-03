import * as tslib_1 from "tslib";
import { Component, Input, } from '@angular/core';
import { map } from 'rxjs/operators';
import { SectionsService } from '../../sections/sections.service';
import { HostWindowService } from '../../../shared/host-window.service';
import { SubmissionService } from '../../submission.service';
/**
 * This component allow to add any new section to submission form
 */
var SubmissionFormSectionAddComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {SectionsService} sectionService
     * @param {SubmissionService} submissionService
     * @param {HostWindowService} windowService
     */
    function SubmissionFormSectionAddComponent(sectionService, submissionService, windowService) {
        this.sectionService = sectionService;
        this.submissionService = submissionService;
        this.windowService = windowService;
    }
    /**
     * Initialize all instance variables
     */
    SubmissionFormSectionAddComponent.prototype.ngOnInit = function () {
        this.sectionList$ = this.submissionService.getDisabledSectionsList(this.submissionId);
        this.hasSections$ = this.sectionList$.pipe(map(function (list) { return list.length > 0; }));
    };
    /**
     * Dispatch an action to add a new section
     */
    SubmissionFormSectionAddComponent.prototype.addSection = function (sectionId) {
        this.sectionService.addSection(this.submissionId, sectionId);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormSectionAddComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormSectionAddComponent.prototype, "submissionId", void 0);
    SubmissionFormSectionAddComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-form-section-add',
            styleUrls: ['./submission-form-section-add.component.scss'],
            templateUrl: './submission-form-section-add.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [SectionsService,
            SubmissionService,
            HostWindowService])
    ], SubmissionFormSectionAddComponent);
    return SubmissionFormSectionAddComponent;
}());
export { SubmissionFormSectionAddComponent };
//# sourceMappingURL=submission-form-section-add.component.js.map
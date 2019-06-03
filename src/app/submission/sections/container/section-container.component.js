import * as tslib_1 from "tslib";
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { SectionsDirective } from '../sections.directive';
import { rendersSectionType } from '../sections-decorator';
import { AlertType } from '../../../shared/alert/aletr-type';
/**
 * This component represents a section that contains the submission license form.
 */
var SubmissionSectionContainerComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     */
    function SubmissionSectionContainerComponent(injector) {
        this.injector = injector;
        /**
         * The AlertType enumeration
         * @type {AlertType}
         */
        this.AlertTypeEnum = AlertType;
    }
    /**
     * Initialize all instance variables
     */
    SubmissionSectionContainerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [
                { provide: 'collectionIdProvider', useFactory: function () { return (_this.collectionId); }, deps: [] },
                { provide: 'sectionDataProvider', useFactory: function () { return (_this.sectionData); }, deps: [] },
                { provide: 'submissionIdProvider', useFactory: function () { return (_this.submissionId); }, deps: [] },
            ],
            parent: this.injector
        });
    };
    /**
     * Remove section from submission form
     *
     * @param event
     *    the event emitted
     */
    SubmissionSectionContainerComponent.prototype.removeSection = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
    };
    /**
     * Find the correct component based on the section's type
     */
    SubmissionSectionContainerComponent.prototype.getSectionContent = function () {
        return rendersSectionType(this.sectionData.sectionType);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionContainerComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionSectionContainerComponent.prototype, "sectionData", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionContainerComponent.prototype, "submissionId", void 0);
    tslib_1.__decorate([
        ViewChild('sectionRef'),
        tslib_1.__metadata("design:type", SectionsDirective)
    ], SubmissionSectionContainerComponent.prototype, "sectionRef", void 0);
    SubmissionSectionContainerComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-container',
            templateUrl: './section-container.component.html',
            styleUrls: ['./section-container.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], SubmissionSectionContainerComponent);
    return SubmissionSectionContainerComponent;
}());
export { SubmissionSectionContainerComponent };
//# sourceMappingURL=section-container.component.js.map
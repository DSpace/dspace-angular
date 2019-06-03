import * as tslib_1 from "tslib";
import { Inject } from '@angular/core';
import { filter, startWith } from 'rxjs/operators';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
/**
 * An abstract model class for a submission edit form section.
 */
var SectionModelComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {string} injectedCollectionId
     * @param {SectionDataObject} injectedSectionData
     * @param {string} injectedSubmissionId
     */
    function SectionModelComponent(injectedCollectionId, injectedSectionData, injectedSubmissionId) {
        this.injectedCollectionId = injectedCollectionId;
        this.injectedSectionData = injectedSectionData;
        this.injectedSubmissionId = injectedSubmissionId;
        this.collectionId = injectedCollectionId;
        this.sectionData = injectedSectionData;
        this.submissionId = injectedSubmissionId;
    }
    /**
     * Call abstract methods on component init
     */
    SectionModelComponent.prototype.ngOnInit = function () {
        this.onSectionInit();
        this.updateSectionStatus();
    };
    /**
     * Subscribe to section status
     */
    SectionModelComponent.prototype.updateSectionStatus = function () {
        var _this = this;
        this.sectionStatusSub = this.getSectionStatus().pipe(filter(function (sectionStatus) { return isNotUndefined(sectionStatus); }), startWith(true))
            .subscribe(function (sectionStatus) {
            _this.sectionService.setSectionStatus(_this.submissionId, _this.sectionData.id, sectionStatus);
        });
    };
    /**
     * Unsubscribe from all subscriptions and Call abstract methods on component destroy
     */
    SectionModelComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sectionStatusSub)) {
            this.sectionStatusSub.unsubscribe();
        }
        this.onSectionDestroy();
    };
    SectionModelComponent = tslib_1.__decorate([
        tslib_1.__param(0, Inject('collectionIdProvider')),
        tslib_1.__param(1, Inject('sectionDataProvider')),
        tslib_1.__param(2, Inject('submissionIdProvider')),
        tslib_1.__metadata("design:paramtypes", [String, Object, String])
    ], SectionModelComponent);
    return SectionModelComponent;
}());
export { SectionModelComponent };
//# sourceMappingURL=section.model.js.map
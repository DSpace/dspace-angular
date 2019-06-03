var SubmissionServiceStub = /** @class */ (function () {
    function SubmissionServiceStub() {
        this.changeSubmissionCollection = jasmine.createSpy('changeSubmissionCollection');
        this.createSubmission = jasmine.createSpy('createSubmission');
        this.depositSubmission = jasmine.createSpy('depositSubmission');
        this.discardSubmission = jasmine.createSpy('discardSubmission');
        this.dispatchInit = jasmine.createSpy('dispatchInit');
        this.dispatchDeposit = jasmine.createSpy('dispatchDeposit');
        this.dispatchDiscard = jasmine.createSpy('dispatchDiscard');
        this.dispatchSave = jasmine.createSpy('dispatchSave');
        this.dispatchSaveForLater = jasmine.createSpy('dispatchSaveForLater');
        this.dispatchSaveSection = jasmine.createSpy('dispatchSaveSection');
        this.getActiveSectionId = jasmine.createSpy('getActiveSectionId');
        this.getSubmissionObject = jasmine.createSpy('getSubmissionObject');
        this.getSubmissionSections = jasmine.createSpy('getSubmissionSections');
        this.getDisabledSectionsList = jasmine.createSpy('getDisabledSectionsList');
        this.getSubmissionObjectLinkName = jasmine.createSpy('getSubmissionObjectLinkName');
        this.getSubmissionScope = jasmine.createSpy('getSubmissionScope');
        this.getSubmissionStatus = jasmine.createSpy('getSubmissionStatus');
        this.getSubmissionSaveProcessingStatus = jasmine.createSpy('getSubmissionSaveProcessingStatus');
        this.getSubmissionDepositProcessingStatus = jasmine.createSpy('getSubmissionDepositProcessingStatus');
        this.isSectionHidden = jasmine.createSpy('isSectionHidden');
        this.isSubmissionLoading = jasmine.createSpy('isSubmissionLoading');
        this.notifyNewSection = jasmine.createSpy('notifyNewSection');
        this.redirectToMyDSpace = jasmine.createSpy('redirectToMyDSpace');
        this.resetAllSubmissionObjects = jasmine.createSpy('resetAllSubmissionObjects');
        this.resetSubmissionObject = jasmine.createSpy('resetSubmissionObject');
        this.retrieveSubmission = jasmine.createSpy('retrieveSubmission');
        this.setActiveSection = jasmine.createSpy('setActiveSection');
        this.startAutoSave = jasmine.createSpy('startAutoSave');
        this.stopAutoSave = jasmine.createSpy('stopAutoSave');
    }
    return SubmissionServiceStub;
}());
export { SubmissionServiceStub };
//# sourceMappingURL=submission-service-stub.js.map
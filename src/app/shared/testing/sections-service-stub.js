var SectionsServiceStub = /** @class */ (function () {
    function SectionsServiceStub() {
        this.checkSectionErrors = jasmine.createSpy('checkSectionErrors');
        this.dispatchRemoveSectionErrors = jasmine.createSpy('dispatchRemoveSectionErrors');
        this.getSectionData = jasmine.createSpy('getSectionData');
        this.getSectionErrors = jasmine.createSpy('getSectionErrors');
        this.getSectionState = jasmine.createSpy('getSectionState');
        this.isSectionValid = jasmine.createSpy('isSectionValid');
        this.isSectionEnabled = jasmine.createSpy('isSectionEnabled');
        this.isSectionReadOnly = jasmine.createSpy('isSectionReadOnly');
        this.isSectionAvailable = jasmine.createSpy('isSectionAvailable');
        this.addSection = jasmine.createSpy('addSection');
        this.removeSection = jasmine.createSpy('removeSection');
        this.updateSectionData = jasmine.createSpy('updateSectionData');
        this.setSectionError = jasmine.createSpy('setSectionError');
        this.setSectionStatus = jasmine.createSpy('setSectionStatus');
    }
    return SectionsServiceStub;
}());
export { SectionsServiceStub };
//# sourceMappingURL=sections-service-stub.js.map
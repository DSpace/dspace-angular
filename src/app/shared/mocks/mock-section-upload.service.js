/**
 * Mock for [[SubmissionFormsConfigService]]
 */
export function getMockSectionUploadService() {
    return jasmine.createSpyObj('SectionUploadService', {
        getUploadedFileList: jasmine.createSpy('getUploadedFileList'),
        getFileData: jasmine.createSpy('getFileData'),
        getDefaultPolicies: jasmine.createSpy('getDefaultPolicies'),
        addUploadedFile: jasmine.createSpy('addUploadedFile'),
        updateFileData: jasmine.createSpy('updateFileData'),
        removeUploadedFile: jasmine.createSpy('removeUploadedFile')
    });
}
//# sourceMappingURL=mock-section-upload.service.js.map
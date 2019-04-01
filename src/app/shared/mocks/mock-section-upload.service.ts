import { SubmissionFormsConfigService } from '../../core/config/submission-forms-config.service';

/**
 * Mock for [[SubmissionFormsConfigService]]
 */
export function getMockSectionUploadService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('SectionUploadService', {
    getUploadedFileList: jasmine.createSpy('getUploadedFileList'),
    getFileData: jasmine.createSpy('getFileData'),
    getDefaultPolicies: jasmine.createSpy('getDefaultPolicies'),
    addUploadedFile: jasmine.createSpy('addUploadedFile'),
    updateFileData: jasmine.createSpy('updateFileData'),
    removeUploadedFile: jasmine.createSpy('removeUploadedFile')
  });
}

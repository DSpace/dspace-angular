import { SubmissionFormsConfigDataService } from '../../core/config/submission-forms-config-data.service';

/**
 * Mock for [[SubmissionFormsConfigService]]
 */
export function getMockSectionUploadService(): SubmissionFormsConfigDataService {
  return jasmine.createSpyObj('SectionUploadService', {
    updatePrimaryBitstreamOperation: jasmine.createSpy('updatePrimaryBitstreamOperation'),
    updateFilePrimaryBitstream: jasmine.createSpy('updateFilePrimaryBitstream'),
    getUploadedFilesData: jasmine.createSpy('getUploadedFilesData'),
    getUploadedFileList: jasmine.createSpy('getUploadedFileList'),
    getFileData: jasmine.createSpy('getFileData'),
    getDefaultPolicies: jasmine.createSpy('getDefaultPolicies'),
    addUploadedFile: jasmine.createSpy('addUploadedFile'),
    updateFileData: jasmine.createSpy('updateFileData'),
    removeUploadedFile: jasmine.createSpy('removeUploadedFile'),
  });
}

import { SubmissionUploadFileAccessConditionObject } from './submission-upload-file-access-condition.model';
import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';

export class WorkspaceitemSectionUploadFileObject {
  uuid: string;
  metadata: WorkspaceitemSectionFormObject;
  sizeBytes: number;
  checkSum: {
    checkSumAlgorithm: string;
    value: string;
  };
  url: string;
  thumbnail: string;
  accessConditions: SubmissionUploadFileAccessConditionObject[];
}

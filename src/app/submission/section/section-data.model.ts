import { SubmissionDataEntry } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionFormObject } from '../models/workspaceitem-section-form.model';
import { WorkspaceitemSectionUploadFileObject } from '../models/workspaceitem-section-upload-file.model';
import { WorkspaceitemSectionLicenseObject } from '../models/workspaceitem-section-license.model';
import { WorkspaceitemSectionDataType } from '../models/workspaceitem-sections.model';

export class SectionDataObject {
  collectionId: string;
  config: string;
  data: WorkspaceitemSectionDataType;
  header: string;
  id: string;
  mandatory: boolean;
  submissionId: string;
  [propName: string]: any;
}

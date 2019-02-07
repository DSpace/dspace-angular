import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from './workspaceitem-section-license.model';
import { WorkspaceitemSectionUploadObject } from './workspaceitem-section-upload.model';
import { WorkspaceitemSectionRecycleObject } from './workspaceitem-section-recycle.model';
import { WorkspaceitemSectionDetectDuplicateObject } from './workspaceitem-section-deduplication.model';

export class WorkspaceitemSectionsObject {
  [name: string]: WorkspaceitemSectionDataType;
}

export type WorkspaceitemSectionDataType
  = WorkspaceitemSectionUploadObject
  | WorkspaceitemSectionFormObject
  | WorkspaceitemSectionLicenseObject
  | WorkspaceitemSectionRecycleObject
  | WorkspaceitemSectionDetectDuplicateObject
  | string;

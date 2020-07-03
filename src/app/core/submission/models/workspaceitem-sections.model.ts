import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from './workspaceitem-section-license.model';
import { WorkspaceitemSectionUploadObject } from './workspaceitem-section-upload.model';
import { WorkspaceitemSectionCcLicenseObject } from './workspaceitem-section-cc-license.model';
import { WorkspaceitemSectionDetectDuplicateObject } from './workspaceitem-section-deduplication.model';

/**
 * An interface to represent submission's section object.
 * A map of section keys to an ordered list of WorkspaceitemSectionDataType objects.
 */
export class WorkspaceitemSectionsObject {
  [name: string]: WorkspaceitemSectionDataType;
}

/**
 * Export a type alias of all sections
 */
export type WorkspaceitemSectionDataType
  = WorkspaceitemSectionUploadObject
  | WorkspaceitemSectionFormObject
  | WorkspaceitemSectionLicenseObject
  | WorkspaceitemSectionCcLicenseObject
  | WorkspaceitemSectionDetectDuplicateObject
  | string;

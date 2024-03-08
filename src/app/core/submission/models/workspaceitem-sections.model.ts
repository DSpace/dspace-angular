import { WorkspaceitemSectionAccessesObject } from './workspaceitem-section-accesses.model';
import { WorkspaceitemSectionCcLicenseObject } from './workspaceitem-section-cc-license.model';
import { WorkspaceitemSectionDuplicatesObject } from './workspaceitem-section-duplicates.model';
import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { WorkspaceitemSectionIdentifiersObject } from './workspaceitem-section-identifiers.model';
import { WorkspaceitemSectionLicenseObject } from './workspaceitem-section-license.model';
import { WorkspaceitemSectionSherpaPoliciesObject } from './workspaceitem-section-sherpa-policies.model';
import { WorkspaceitemSectionUploadObject } from './workspaceitem-section-upload.model';

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
  | WorkspaceitemSectionAccessesObject
  | WorkspaceitemSectionSherpaPoliciesObject
  | WorkspaceitemSectionIdentifiersObject
  | WorkspaceitemSectionDuplicatesObject
  | string;



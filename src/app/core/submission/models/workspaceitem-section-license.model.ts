import { WorkspaceitemSectionUploadFileObject } from './workspaceitem-section-upload-file.model';

/**
 * An interface to represent submission's license section data.
 */
export interface WorkspaceitemSectionLicenseObject {
  /**
   * The license url
   */
  url: string;

  /**
   * The acceptance date of the license
   */
  acceptanceDate: string;

  /**
   * A boolean representing if license has been granted
   */
  granted: boolean;

  /**
   * TAMU Customization - A string representing which license has been selected
   */
  selected?: string;

  /**
   * TAMU Customization - A list of license files [[WorkspaceitemSectionUploadFileObject]]
   */
  files?: WorkspaceitemSectionUploadFileObject[];
}

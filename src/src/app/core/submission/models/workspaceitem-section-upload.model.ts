import { WorkspaceitemSectionUploadFileObject } from './workspaceitem-section-upload-file.model';

/**
 * An interface to represent submission's upload section data.
 */
export interface WorkspaceitemSectionUploadObject {
  /**
   * Primary bitstream flag
   */
  primary: string | null;
  /**
   * A list of [[WorkspaceitemSectionUploadFileObject]]
   */
  files: WorkspaceitemSectionUploadFileObject[];
}

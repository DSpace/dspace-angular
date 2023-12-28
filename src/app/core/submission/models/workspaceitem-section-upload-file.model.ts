import { SubmissionUploadFileAccessConditionObject } from './submission-upload-file-access-condition.model';
import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { ChecksumInfo } from '../../shared/bitstream.model';

/**
 * An interface to represent submission's upload section file entry.
 */
export class WorkspaceitemSectionUploadFileObject {

  /**
   * The file UUID
   */
  uuid: string;

  /**
   * The file metadata
   */
  metadata: WorkspaceitemSectionFormObject;

  /**
   * The file size
   */
  sizeBytes: number;

  /**
   * The file check sum
   */
  checkSum: ChecksumInfo;

  /**
   * The file format information
   */
  format: {
    shortDescription: string,
    description: string,
    mimetype: string,
    supportLevel: string,
    internal: boolean,
    type: string
  };

  /**
   * The file url
   */
  url: string;

  /**
   * The file thumbnail url
   */
  thumbnail: string;

  /**
   * The list of file access conditions
   */
  accessConditions: SubmissionUploadFileAccessConditionObject[];
}

import { Metadatum } from '../../core/shared/metadatum.model';
import { SubmissionUploadFileAccessConditionObject } from './submission-upload-file-access-condition.model';

export class SubmissionUploadFileObject {
  name: string;
  metadata: Metadatum[];
  sizeBytes: number;
  checkSum: {
    checkSumAlgorithm: string;
    value: string;
  };
  url: string;
  thumbnail: string;
  accessConditions: SubmissionUploadFileAccessConditionObject[];
}

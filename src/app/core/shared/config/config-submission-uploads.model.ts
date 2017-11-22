import { autoserialize, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';

@inheritSerialization(ConfigObject)
export class SubmissionUploadsModel extends ConfigObject {

  @autoserialize
  accessConditionOptions: Array<{
    name: string;
    groupUUID: string;
    hasStartDate: boolean;
    hasEndDate: boolean;
    maxStartDate: string;
    maxEndDate: string;
  }>;

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

}

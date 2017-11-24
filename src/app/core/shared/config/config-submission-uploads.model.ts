import { autoserialize, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';

@inheritSerialization(ConfigObject)
export class SubmissionUploadsModel extends ConfigObject {

  @autoserialize
  accessConditionOptions: AccessConditionOption[];

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

}

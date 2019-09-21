import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { ResourceType } from '../../shared/resource-type';

export class SubmissionUploadsModel extends ConfigObject {
  static type =  new ResourceType('submissionupload');
  /**
   * A list of available bitstream access conditions
   */
  accessConditionOptions: AccessConditionOption[];

  /**
   * An object representing the configuration describing the bistream metadata form
   */
  metadata: SubmissionFormsModel;

  required: boolean;

  maxSize: number;

}

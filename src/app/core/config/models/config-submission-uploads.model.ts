import { autoserialize } from 'cerialize';
import { resourceType } from '../../cache/builders/build-decorators';
import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { ResourceType } from '../../shared/resource-type';

@resourceType(SubmissionUploadsModel.type)
export class SubmissionUploadsModel extends ConfigObject {
  static type =  new ResourceType('submissionupload');
  /**
   * A list of available bitstream access conditions
   */
  @autoserialize
  accessConditionOptions: AccessConditionOption[];

  /**
   * An object representing the configuration describing the bistream metadata form
   */
  @autoserialize
  metadata: SubmissionFormsModel;

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

}

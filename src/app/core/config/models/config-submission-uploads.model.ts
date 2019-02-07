import {autoserialize, autoserializeAs, inheritSerialization} from 'cerialize';
import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';
import {SubmissionFormsModel} from './config-submission-forms.model';

/**
 * Normalized model class for the configuration describing the submission upload section
 */
@inheritSerialization(ConfigObject)
export class SubmissionUploadsModel extends ConfigObject {

  /**
   * A list of available bitstream access conditions
   */
  @autoserialize
  accessConditionOptions: AccessConditionOption[];

  /**
   * An object representing the configuration describing the bistream metadata form
   */
  @autoserializeAs(SubmissionFormsModel)
  metadata: SubmissionFormsModel;

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

}

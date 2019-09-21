import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { AccessConditionOption } from './config-access-condition-option.model';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { NormalizedConfigObject } from './normalized-config.model';
import { SubmissionUploadsModel } from './config-submission-uploads.model';
import { mapsTo } from '../../cache/builders/build-decorators';

/**
 * Normalized class for the configuration describing the submission upload section
 */
@mapsTo(SubmissionUploadsModel)
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionUploadsModel extends NormalizedConfigObject<SubmissionUploadsModel> {

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

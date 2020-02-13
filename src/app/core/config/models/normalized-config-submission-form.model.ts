import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
import { FormRowModel, SubmissionFormModel } from './config-submission-form.model';

/**
 * Normalized class for the configuration describing the submission form
 */
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionFormModel extends NormalizedConfigObject<SubmissionFormModel> {

  /**
   * An array of [FormRowModel] that are present in this form
   */
  @autoserialize
  rows: FormRowModel[];
}

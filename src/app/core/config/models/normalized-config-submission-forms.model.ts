import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
import { FormRowModel, SubmissionFormsModel } from './config-submission-forms.model';

/**
 * Normalized class for the configuration describing the submission form
 */
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionFormsModel extends NormalizedConfigObject<SubmissionFormsModel> {

  /**
   * An array of [FormRowModel] that are present in this form
   */
  @autoserialize
  rows: FormRowModel[];
}

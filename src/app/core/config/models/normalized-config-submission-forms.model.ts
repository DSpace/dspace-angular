import { inheritSerialization } from 'cerialize';
import { NormalizedSubmissionFormModel } from './normalized-config-submission-form.model';

/**
 * Normalized class for the configuration describing the submission form
 */
@inheritSerialization(NormalizedSubmissionFormModel)
export class NormalizedSubmissionFormsModel extends NormalizedSubmissionFormModel {
}

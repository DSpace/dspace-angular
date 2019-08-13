import { inheritSerialization } from 'cerialize';
import { mapsTo } from '../../cache/builders/build-decorators';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { NormalizedSubmissionFormModel } from './normalized-config-submission-form.model';

/**
 * Normalized class for the configuration describing the submission form
 */
@mapsTo(SubmissionFormsModel)
@inheritSerialization(NormalizedSubmissionFormModel)
export class NormalizedSubmissionFormsModel extends NormalizedSubmissionFormModel {
}

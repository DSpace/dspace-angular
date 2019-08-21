import { SubmissionFormModel } from './config-submission-form.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a NormalizedObject.
 */
export class SubmissionFormsModel extends SubmissionFormModel {
  static type = new ResourceType('submissionforms');
}

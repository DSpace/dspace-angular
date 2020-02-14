import { inheritSerialization } from 'cerialize';
import { resourceType } from '../../cache/builders/build-decorators';
import { SubmissionFormModel } from './config-submission-form.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a NormalizedObject.
 */
@resourceType(SubmissionFormsModel.type)
@inheritSerialization(SubmissionFormModel)
export class SubmissionFormsModel extends SubmissionFormModel {
  static type = new ResourceType('submissionforms');
}

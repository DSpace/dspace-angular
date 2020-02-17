import { inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { SubmissionFormModel } from './config-submission-form.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a NormalizedObject.
 */
@typedObject
@inheritSerialization(SubmissionFormModel)
export class SubmissionFormsModel extends SubmissionFormModel {
  static type = new ResourceType('submissionforms');
}

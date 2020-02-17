import { inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { SubmissionSectionModel } from './config-submission-section.model';
import { ResourceType } from '../../shared/resource-type';

@typedObject
@inheritSerialization(SubmissionSectionModel)
export class SubmissionSectionsModel extends SubmissionSectionModel {
  static type = new ResourceType('submissionsections');
}

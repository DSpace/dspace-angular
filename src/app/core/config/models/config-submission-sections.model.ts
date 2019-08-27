import { SubmissionSectionModel } from './config-submission-section.model';
import { ResourceType } from '../../shared/resource-type';

export class SubmissionSectionsModel extends SubmissionSectionModel {
  static type = new ResourceType('submissionsections');
}

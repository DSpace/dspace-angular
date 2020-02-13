import { resourceType } from '../../cache/builders/build-decorators';
import { SubmissionSectionModel } from './config-submission-section.model';
import { ResourceType } from '../../shared/resource-type';

@resourceType(SubmissionSectionsModel.type)
export class SubmissionSectionsModel extends SubmissionSectionModel {
  static type = new ResourceType('submissionsections');
}

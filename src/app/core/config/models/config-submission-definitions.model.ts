import { SubmissionDefinitionModel } from './config-submission-definition.model';
import { ResourceType } from '../../shared/resource-type';

export class SubmissionDefinitionsModel extends SubmissionDefinitionModel {
  static type = new ResourceType('submissiondefinitions');

}

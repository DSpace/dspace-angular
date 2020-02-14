import { inheritSerialization } from 'cerialize';
import { resourceType } from '../../cache/builders/build-decorators';
import { SubmissionDefinitionModel } from './config-submission-definition.model';
import { ResourceType } from '../../shared/resource-type';

@resourceType(SubmissionDefinitionsModel.type)
@inheritSerialization(SubmissionDefinitionModel)
export class SubmissionDefinitionsModel extends SubmissionDefinitionModel {
  static type = new ResourceType('submissiondefinitions');

}

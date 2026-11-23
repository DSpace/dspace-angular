import { inheritSerialization } from 'cerialize';

import {
  inheritLinkAnnotations,
  typedObject,
} from '../../cache/builders/build-decorators';
import { SubmissionDefinitionModel } from './config-submission-definition.model';
import { SUBMISSION_DEFINITIONS_TYPE } from './config-type';

@typedObject
@inheritSerialization(SubmissionDefinitionModel)
@inheritLinkAnnotations(SubmissionDefinitionModel)
export class SubmissionDefinitionsModel extends SubmissionDefinitionModel {
  static type = SUBMISSION_DEFINITIONS_TYPE;

}

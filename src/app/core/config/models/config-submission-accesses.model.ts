import { inheritSerialization } from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { SubmissionAccessModel } from './config-submission-access.model';
import { SUBMISSION_ACCESSES_TYPE } from './config-type';

@typedObject
@inheritSerialization(SubmissionAccessModel)
export class SubmissionAccessesModel extends SubmissionAccessModel {
  static type = SUBMISSION_ACCESSES_TYPE;
}

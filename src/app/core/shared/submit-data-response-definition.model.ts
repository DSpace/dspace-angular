import { ConfigObject } from '../config/models/config.model';
import { SubmissionObject } from '../submission/models/submission-object.model';

export type SubmitDataResponseDefinitionObject
  = Array<SubmissionObject | ConfigObject | string>;

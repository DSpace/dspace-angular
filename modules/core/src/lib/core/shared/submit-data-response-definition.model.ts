import { ConfigObject } from '../config';
import { SubmissionObject } from '../submission';

/**
 * Defines a type for submission request responses.
 */
export type SubmitDataResponseDefinitionObject
  = (SubmissionObject | ConfigObject | string)[];

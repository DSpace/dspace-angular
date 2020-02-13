import { inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
import { SubmissionDefinitionsModel } from './config-submission-definitions.model';
import { NormalizedSubmissionDefinitionModel } from './normalized-config-submission-definition.model';

/**
 * Normalized class for the configuration describing the submission
 */
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionDefinitionsModel extends NormalizedSubmissionDefinitionModel {
}

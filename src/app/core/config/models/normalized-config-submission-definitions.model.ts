import { inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
import { SubmissionDefinitionsModel } from './config-submission-definitions.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { NormalizedSubmissionDefinitionModel } from './normalized-config-submission-definition.model';

/**
 * Normalized class for the configuration describing the submission
 */
@mapsTo(SubmissionDefinitionsModel)
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionDefinitionsModel extends NormalizedSubmissionDefinitionModel {
}

import { inheritSerialization } from 'cerialize';
import { SubmissionSectionsModel } from './config-submission-sections.model';
import { NormalizedSubmissionSectionModel } from './normalized-config-submission-section.model';

/**
 * Normalized class for the configuration describing the submission section
 */
@inheritSerialization(NormalizedSubmissionSectionModel)
export class NormalizedSubmissionSectionsModel extends NormalizedSubmissionSectionModel {
}

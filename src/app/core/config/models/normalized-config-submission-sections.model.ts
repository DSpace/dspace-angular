import { inheritSerialization } from 'cerialize';
import { mapsTo } from '../../cache/builders/build-decorators';
import { SubmissionSectionsModel } from './config-submission-sections.model';
import { NormalizedSubmissionSectionModel } from './normalized-config-submission-section.model';

/**
 * Normalized class for the configuration describing the submission section
 */
@mapsTo(SubmissionSectionsModel)
@inheritSerialization(NormalizedSubmissionSectionModel)
export class NormalizedSubmissionSectionsModel extends NormalizedSubmissionSectionModel {
}

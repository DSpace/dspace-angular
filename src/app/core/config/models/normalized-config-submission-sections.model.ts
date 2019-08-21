import { autoserialize, inheritSerialization } from 'cerialize';
import { SectionsType } from '../../../submission/sections/sections-type';
import { NormalizedConfigObject } from './normalized-config.model';
import {
  SubmissionSectionModel,
  SubmissionSectionVisibility
} from './config-submission-section.model';
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

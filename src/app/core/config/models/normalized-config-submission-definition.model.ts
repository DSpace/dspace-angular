import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { PaginatedList } from '../../data/paginated-list';
import { SubmissionDefinitionModel } from './config-submission-definition.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { NormalizedConfigObject } from './normalized-config.model';

/**
 * Normalized class for the configuration describing the submission
 */
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionDefinitionModel extends NormalizedConfigObject<SubmissionDefinitionModel> {

  /**
   * A boolean representing if this submission definition is the default or not
   */
  @autoserialize
  isDefault: boolean;

  /**
   * A list of SubmissionSectionModel that are present in this submission definition
   */
  @autoserializeAs(SubmissionSectionModel)
  sections: PaginatedList<SubmissionSectionModel>;

}

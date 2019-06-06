import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { SubmissionSectionModel } from './config-submission-section.model';
import { PaginatedList } from '../../data/paginated-list';
import { NormalizedConfigObject } from './normalized-config.model';
import { SubmissionDefinitionsModel } from './config-submission-definitions.model';

/**
 * Normalized class for the configuration describing the submission
 */
@inheritSerialization(NormalizedConfigObject)
export class NormalizedSubmissionDefinitionsModel extends NormalizedConfigObject<SubmissionDefinitionsModel> {

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

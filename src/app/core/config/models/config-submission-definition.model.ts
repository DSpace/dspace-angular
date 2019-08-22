import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { PaginatedList } from '../../data/paginated-list';
import { ResourceType } from '../../shared/resource-type';

/**
 * Class for the configuration describing the submission
 */
export class SubmissionDefinitionModel extends ConfigObject {
  static type = new ResourceType('submissiondefinition');

  /**
   * A boolean representing if this submission definition is the default or not
   */
  isDefault: boolean;

  /**
   * A list of SubmissionSectionModel that are present in this submission definition
   */
  sections: PaginatedList<SubmissionSectionModel>;

}

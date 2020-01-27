import { PaginatedList } from '../../data/paginated-list';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { SubmissionSectionModel } from './config-submission-section.model';
import { ConfigObject } from './config.model';

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

  /**
   * The links to all related resources returned by the rest api.
   */
  _links: {
    self: HALLink,
    collections: HALLink,
    sections: HALLink
  };

}

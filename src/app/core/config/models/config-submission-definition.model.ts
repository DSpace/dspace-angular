import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { PaginatedList } from '../../data/paginated-list';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { SubmissionSectionModel } from './config-submission-section.model';
import { ConfigObject } from './config.model';

/**
 * Class for the configuration describing the submission
 */
@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionDefinitionModel extends ConfigObject {
  static type = new ResourceType('submissiondefinition');

  /**
   * A boolean representing if this submission definition is the default or not
   */
  @autoserialize
  isDefault: boolean;

  /**
   * A list of SubmissionSectionModel that are present in this submission definition
   */
  // TODO refactor using remotedata
  @deserialize
  sections: PaginatedList<SubmissionSectionModel>;

  /**
   * The links to all related resources returned by the rest api.
   */
  @deserialize
  _links: {
    self: HALLink,
    collections: HALLink,
    sections: HALLink
  };

}

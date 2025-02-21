import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import { PaginatedList } from '../../data';
import { HALLink } from '../../shared';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { SUBMISSION_DEFINITION_TYPE } from './config-type';

/**
 * Class for the configuration describing the submission
 */
@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionDefinitionModel extends ConfigObject {
  static type = SUBMISSION_DEFINITION_TYPE;

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

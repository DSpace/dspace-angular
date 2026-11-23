import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache/builders/build-decorators';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { HALLink } from '../../shared/hal-link.model';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import {
  SUBMISSION_DEFINITION_TYPE,
  SUBMISSION_SECTION_TYPE,
} from './config-type';

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
   * A list of SubmissionSectionModel that are present in this submission definition.
   *
   * This is resolved from the `sections` {@link HALLink}. It will be an
   * {@link Observable} of {@link RemoteData} of a {@link PaginatedList} once the link has been
   * resolved by the {@link LinkService}, or an embedded {@link PaginatedList} when the sections were
   * embedded in the response. Registering it as a {@link link} ensures it is picked up by the
   * Angular HAL client / link registry and (de)serialized by the remote-data build service.
   */
  @link(SUBMISSION_SECTION_TYPE, true)
  sections: Observable<RemoteData<PaginatedList<SubmissionSectionModel>>> | PaginatedList<SubmissionSectionModel>;

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

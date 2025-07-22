import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import { HALLink } from '../../shared';
import {
  SectionScope,
  SectionsType,
  SectionVisibility,
} from '../../submission';
import { ConfigObject } from './config.model';
import { SUBMISSION_SECTION_TYPE } from './config-type';

@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionSectionModel extends ConfigObject {
  static type = SUBMISSION_SECTION_TYPE;

  /**
   * The header for this section
   */
  @autoserialize
  header: string;

  /**
   * A boolean representing if this submission section is the mandatory or not
   */
  @autoserialize
  mandatory: boolean;

  /**
   * The submission scope for this section
   */
  @autoserialize
  scope: SectionScope;

  /**
   * A string representing the kind of section object
   */
  @autoserialize
  sectionType: SectionsType;

  /**
   * The [SectionVisibility] object for this section
   */
  @autoserialize
  visibility: SectionVisibility;

  /**
   * The {@link HALLink}s for this SubmissionSectionModel
   */
  @deserialize
  _links: {
    self: HALLink;
    config: HALLink;
  };

}

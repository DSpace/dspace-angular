import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { SectionsType } from '../../../submission/sections/sections-type';
import { typedObject } from '../../cache/builders/build-decorators';
import { HALLink } from '../../shared/hal-link.model';
import { ConfigObject } from './config.model';
import { SUBMISSION_SECTION_TYPE } from './config-type';

/**
 * An Enum defining the possible visibility values
 */
export enum SubmissionVisibilityValue {
  ReadOnly = 'read-only',
  Hidden = 'hidden'
}

/**
 * An interface that define section visibility and its properties.
 */
export interface SubmissionVisibilityType {
  [scope: string]: SubmissionVisibilityValue;
}

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
   * A boolean representing if this submission section is opened or collapsed by default
   */
  @autoserialize
  opened: boolean;

  /**
   * A string representing the kind of section object
   */
  @autoserialize
  sectionType: SectionsType;

  /**
   * The [SubmissionVisibilityType] object for this section
   */
  @autoserialize
  visibility: SubmissionVisibilityType;

  /**
   * The {@link HALLink}s for this SubmissionSectionModel
   */
  @deserialize
  _links: {
    self: HALLink;
    config: HALLink;
  };

}

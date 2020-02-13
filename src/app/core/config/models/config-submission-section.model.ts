import { autoserialize, deserialize } from 'cerialize';
import { resourceType } from '../../cache/builders/build-decorators';
import { HALLink } from '../../shared/hal-link.model';
import { ConfigObject } from './config.model';
import { SectionsType } from '../../../submission/sections/sections-type';
import { ResourceType } from '../../shared/resource-type';

/**
 * An interface that define section visibility and its properties.
 */
export interface SubmissionSectionVisibility {
  main: any,
  other: any
}

@resourceType(SubmissionSectionModel.type)
export class SubmissionSectionModel extends ConfigObject {
  static type = new ResourceType('submissionsection');

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
   * A string representing the kind of section object
   */
  @autoserialize
  sectionType: SectionsType;

  /**
   * The [SubmissionSectionVisibility] object for this section
   */
  @autoserialize
  visibility: SubmissionSectionVisibility;

  /**
   * The HALLinks for this SubmissionSectionModel
   */
  @deserialize
  _links: {
    self: HALLink;
  }

}

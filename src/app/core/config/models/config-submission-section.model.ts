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

export class SubmissionSectionModel extends ConfigObject {
  static type = new ResourceType('submissionsection');

  /**
   * The header for this section
   */
  header: string;

  /**
   * A boolean representing if this submission section is the mandatory or not
   */
  mandatory: boolean;

  /**
   * A string representing the kind of section object
   */
  sectionType: SectionsType;

  /**
   * The [SubmissionSectionVisibility] object for this section
   */
  visibility: SubmissionSectionVisibility

}

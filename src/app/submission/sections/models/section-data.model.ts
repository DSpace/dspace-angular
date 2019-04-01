import { SubmissionSectionError } from '../../objects/submission-objects.reducer';
import { WorkspaceitemSectionDataType } from '../../../core/submission/models/workspaceitem-sections.model';
import { SectionsType } from '../sections-type';

/**
 * An interface to represent section model
 */
export interface SectionDataObject {

  /**
   * The section configuration url
   */
  config: string;

  /**
   * The section data object
   */
  data: WorkspaceitemSectionDataType;

  /**
   * The list of the section errors
   */
  errors: SubmissionSectionError[];

  /**
   * The section header
   */
  header: string;

  /**
   * The section id
   */
  id: string;

  /**
   * A boolean representing if this section is mandatory
   */
  mandatory: boolean;

  /**
   * The section type
   */
  sectionType: SectionsType;

  /**
   * Eventually additional fields
   */
  [propName: string]: any;
}

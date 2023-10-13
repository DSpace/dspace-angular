import { SectionsType } from '../sections/sections-type';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';
import { SubmissionSectionError } from './submission-section-error.model';
import { SubmissionVisibilityType } from '../../core/config/models/config-submission-section.model';

/**
 * An interface to represent section object state
 */
export interface SubmissionSectionObject {
  /**
   * The section header
   */
  header: string;

  /**
   * The section configuration url
   */
  config: string;

  /**
   * A boolean representing if this section is mandatory
   */
  mandatory: boolean;

  /**
   * A boolean representing if this section is opened or collapsed by default
   */
  opened: boolean;

  /**
   * The section type
   */
  sectionType: SectionsType;

  /**
   * The section visibility
   */
  visibility: SubmissionVisibilityType;

  /**
   * A boolean representing if this section is collapsed
   */
  collapsed: boolean;

  /**
   * A boolean representing if this section is enabled
   */
  enabled: boolean;

  /**
   * The list of the metadata ids of the section.
   */
  metadata: string[];

  /**
   * The section data object
   */
  data: WorkspaceitemSectionDataType;

  /**
   * The list of the section's errors to show. It contains the error list to display when section is not pristine
   */
  errorsToShow: SubmissionSectionError[];

  /**
   * The list of the section's errors detected by the server. They may not be shown yet if section is pristine
   */
  serverValidationErrors: SubmissionSectionError[];

  /**
   * A boolean representing if this section is loading
   */
  isLoading: boolean;

  /**
   * A boolean representing if this section removal is pending
   */
  removePending: boolean;

  /**
   * A boolean representing if this section is valid
   */
  isValid: boolean;

  /**
   * The formId related to this section
   */
  formId: string;
}

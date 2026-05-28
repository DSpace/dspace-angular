/**
 * An Enum defining the possible visibility values
 */
export enum SubmissionVisibilityValue {
  ReadOnly = 'read-only',
  Hidden = 'hidden'
}

/**
 * Types of possible section's visibility
 */
export type SectionVisibilityType = 'main' | 'other' | 'submission' | 'workspace' | 'workflow';

/**
 * An interface that define section visibility and its properties.
 */
export type SubmissionVisibilityType = {
  [key in SectionVisibilityType]: SubmissionVisibilityValue;
};;


export enum SectionScope {
  Submission = 'SUBMISSION',
  Workflow = 'WORKFLOW',
}

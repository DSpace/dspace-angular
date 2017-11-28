/**
 * TODO replace with actual string enum after upgrade to TypeScript 2.4:
 * https://github.com/Microsoft/TypeScript/pull/15486
 */
import { ResourceType } from '../resource-type';

export enum ConfigType {
  SubmissionDefinitions = 'submissiondefinitions',
  SubmissionDefinition = 'submissiondefinition',
  SubmissionForm = 'submissionform',
  SubmissionForms = 'submissionforms',
  SubmissionSections = 'submissionsections',
  SubmissionSection = 'submissionsection'
}

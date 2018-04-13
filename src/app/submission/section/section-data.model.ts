import { SubmissionSectionError } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionDataType, WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { SectionType } from './section-type';

export interface SectionDataObject {
  config: string;
  data: WorkspaceitemSectionDataType;
  errors: SubmissionSectionError[];
  header: string;
  id: string;
  mandatory: boolean;
  sectionType: SectionType;
  [propName: string]: any;
}

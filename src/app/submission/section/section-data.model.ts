import { SubmissionSectionError } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionDataType, WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';

export interface SectionDataObject {
  config: string;
  data: WorkspaceitemSectionDataType;
  errors: SubmissionSectionError[];
  header: string;
  id: string;
  mandatory: boolean;
  [propName: string]: any;
}

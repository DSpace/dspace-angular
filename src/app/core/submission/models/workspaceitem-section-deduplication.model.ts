import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { WorkspaceitemSectionUploadFileObject } from './workspaceitem-section-upload-file.model';
import { FormFieldChangedObject } from '../../../shared/form/builder/models/form-field-unexpected-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

export interface WorkspaceitemSectionDeduplicationObject {
  matches: DeduplicationSchema[];
}

export interface DeduplicationSchema {
  submitterDecision: string; // [reject|verify]
  submitterNote: string;
  submitterTime: string; // (readonly)

  workflowDecision: string; // [reject|verify]
  workflowNote: string;
  workflowTime: string; // (readonly)

  matchObject: DSpaceObject; // item, workspaceItem, workflowItem
}

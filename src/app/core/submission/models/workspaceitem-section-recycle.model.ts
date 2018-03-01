import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { WorkspaceitemSectionUploadFileObject } from './workspaceitem-section-upload-file.model';
import { FormFieldChangedObject } from '../../../shared/form/builder/models/form-field-unexpected-object.model';

export interface WorkspaceitemSectionRecycleObject {
  unexpected: any;
  metadata: FormFieldMetadataValueObject[];
  files: WorkspaceitemSectionUploadFileObject[];
}



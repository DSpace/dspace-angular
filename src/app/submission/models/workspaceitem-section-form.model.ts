import { WorkspaceitemMetadataValueObject } from './workspaceitem-metadata-value.model';

export interface WorkspaceitemSectionFormObject {
  [metadata: string]: WorkspaceitemMetadataValueObject;
}

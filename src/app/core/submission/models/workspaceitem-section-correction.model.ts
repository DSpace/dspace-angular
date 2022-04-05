/**
 * An interface to represent submission's correction section data.
 */
export interface WorkspaceitemSectionCorrectionObject {
    metadata: WorkspaceitemSectionCorrectionMetadataObject[];
    bitstream: WorkspaceitemSectionCorrectionBitstreamObject[];
  }

export interface WorkspaceitemSectionCorrectionMetadataObject {
metadata: string;
oldValues: string[];
newValues: string[];
label: string;
}

export enum OperationType {
ADD = 'ADD',
REMOVE = 'REMOVE',
MODIFY = 'MODIFY'
}

export interface WorkspaceitemSectionCorrectionBitstreamObject {
filename: string;
operationType: OperationType;
metadata: WorkspaceitemSectionCorrectionMetadataObject[];
policies: WorkspaceitemSectionCorrectionBitstreamPolicyObject[];
}

export interface WorkspaceitemSectionCorrectionBitstreamPolicyObject {
oldValue: string;
newValue: string;
label: string;
}

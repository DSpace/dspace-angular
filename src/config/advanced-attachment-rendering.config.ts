/**
 * Interface configuration to show/hide advnaced attachment informations
 */
export interface AdvancedAttachmentRenderingConfig {
  metadata: AttachmentMetadataConfig[];
  pagination: AdvancedAttachmentRenderingPaginationConfig;
}

export interface AttachmentMetadataConfig {
  name: string;
  type: AdvancedAttachmentElementType;
  truncatable?: boolean;
}

export enum AdvancedAttachmentElementType {
  Metadata = 'metadata',
  Attribute = 'attribute'
}

export interface AdvancedAttachmentRenderingPaginationConfig {
  enabled: boolean;
  elementsPerPage: number;
}

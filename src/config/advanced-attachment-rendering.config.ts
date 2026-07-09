/**
 * Interface configuration to define the advanced attachment rendering settings
 */
export interface AdvancedAttachmentRenderingConfig {
  metadata: AttachmentMetadataConfig[];
  pagination: AttachmentRenderingPaginationConfig
}

/**
 * Interface configuration to select which are the advanced attachment information to show
 */
export interface AttachmentMetadataConfig {
  name: string;
  type: AdvancedAttachmentElementType;
  truncatable?: boolean;
}

/**
 * Interface configuration to define the type for each element shown in the advanced attachment feature
 */
export enum AdvancedAttachmentElementType {
  Metadata = 'metadata',
  Attribute = 'attribute'
}

/**
 * Interface configuration of attachment pagination
 */
export interface AttachmentRenderingPaginationConfig {
  enabled: boolean;
  elementsPerPage: number;
}


/**
 * Interface configuration to define the advanced attachment rendering settings
 */
export interface AdvancedAttachmentRenderingConfig {
  metadata: AttachmentMetadataConfig[];
  pagination: AdvancedAttachmentRenderingPaginationConfig;
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
 * Interface configuration to define the pagination of the advanced attachment rendering
 */
export interface AdvancedAttachmentRenderingPaginationConfig {
  enabled: boolean;
  elementsPerPage: number;
}

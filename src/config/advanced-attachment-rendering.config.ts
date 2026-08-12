/**
 * Interface configuration to define the advanced attachment rendering settings
 */
export interface AdvancedAttachmentRenderingConfig {
  metadata: AttachmentMetadataConfig[];
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


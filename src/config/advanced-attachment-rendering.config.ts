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
  /**
   * Controls who can see this attachment element.
   * When omitted, the element is treated as {@link AdvancedAttachmentVisibility.Public}.
   * To hide an element from everyone, remove it from the metadata list entirely.
   */
  visibility?: AdvancedAttachmentVisibility;
}

/**
 * Interface configuration to define the type for each element shown in the advanced attachment feature
 */
export enum AdvancedAttachmentElementType {
  Metadata = 'metadata',
  Attribute = 'attribute'
}

/**
 * Controls the audience that can see an advanced attachment element.
 */
export enum AdvancedAttachmentVisibility {
  /**
   * Visible to everyone, including anonymous users (default when no visibility is configured).
   */
  Public = 'public',
  /**
   * Visible only to site administrators.
   */
  Admin = 'admin'
}


/**
 * Configuration for advanced attachment rendering in the dynamic layout system.
 * Controls which metadata/attributes are displayed for bitstream attachments
 * and how pagination is handled.
 */
export interface AdvancedAttachmentRenderingConfig {
  /** Array of metadata/attribute columns to display for each attachment. */
  metadata: AttachmentMetadataConfig[];
  /** Pagination configuration for the attachment list. */
  pagination: AttachmentRenderingPaginationConfig
}

/**
 * Configuration for a single metadata or attribute column in the advanced attachment display.
 */
export interface AttachmentMetadataConfig {
  /** The metadata field name or attribute identifier. */
  name: string;
  /** Whether this config refers to a metadata field or a bitstream attribute. */
  type: AdvancedAttachmentElementType;
  /** Whether long values should be truncatable with a "show more" toggle. */
  truncatable?: boolean;
}

/**
 * Discriminator for advanced attachment element types.
 */
export enum AdvancedAttachmentElementType {
  /** Refers to a bitstream metadata field. */
  Metadata = 'metadata',
  /** Refers to a bitstream attribute (e.g., file size, format). */
  Attribute = 'attribute'
}

/**
 * Pagination settings for the attachment rendering list.
 */
export interface AttachmentRenderingPaginationConfig {
  /** Whether pagination is enabled for the attachment list. */
  enabled: boolean;
  /** Maximum number of attachments to display per page. */
  elementsPerPage: number;
}


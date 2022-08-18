/**
 * Interface configuration to show/hide advnaced attachment informations
 */
export interface AttachmentRenderingConfig {
  pagination: AttachmentRenderingPaginationConfig
}

export interface AttachmentRenderingPaginationConfig {
  enabled: boolean;
  elementsPerPage: number;
}

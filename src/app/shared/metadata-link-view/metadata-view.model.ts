/**
 * Interface representing metadata information for rendering authority-controlled metadata values with entity details.
 * This model is used by the MetadataLinkViewComponent and its child components to display metadata values
 * that reference other DSpace entities (e.g., authors, contributors, organizations) with enhanced information.
 */
export interface MetadataView {
  authority: string;
  value: string;
  orcidAuthenticated: string;
  entityType: string;
}

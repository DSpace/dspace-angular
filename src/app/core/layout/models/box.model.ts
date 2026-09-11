/**
 * Defines a metadata group within a layout field, grouping related metadata entries.
 */
export interface MetadataGroup {
  /** The leading metadata key that acts as the group heading. */
  leading: string;
  /** Array of layout fields within this group. */
  elements: LayoutField[];
}

/**
 * Configuration for bitstream-related rendering in a layout field.
 */
export interface LayoutBitstream {
  /** The bundle name to filter bitstreams from. */
  bundle: string;
  /** The metadata field used to identify the bitstream. */
  metadataField: string;
  /** The metadata value to match for selecting the bitstream. */
  metadataValue: string;
}

/**
 * Enum of layout field types that determine how a field is rendered.
 */
export enum LayoutFieldType {
  METADATA = 'METADATA',
  METADATAGROUP = 'METADATAGROUP',
  BITSTREAM = 'BITSTREAM'
}

/**
 * Describes a single renderable field within a metadata box row.
 * Contains the metadata key, rendering type, and styling options.
 */
export interface LayoutField {
  /** The metadata key to display (e.g., 'dc.title', 'dc.contributor.author'). */
  metadata?: string;
  /** Bitstream configuration if this field renders a bitstream. */
  bitstream?: LayoutBitstream;
  /** i18n label key for the field. */
  label?: string;
  /** The rendering type identifier (e.g., 'text', 'link', 'date', 'thumbnail'). */
  rendering: string;
  /** The field type discriminator. */
  fieldType: LayoutFieldType | string;
  /** CSS classes for the overall field container. */
  style?: string;
  /** CSS classes for the label column. */
  styleLabel?: string;
  /** CSS classes for the value column. */
  styleValue?: string;
  /** Nested metadata group configuration if fieldType is METADATAGROUP. */
  metadataGroup?: MetadataGroup;
  /** Whether to render the label as a heading element. */
  labelAsHeading: boolean;
  /** Whether to render multiple values inline (comma-separated) rather than stacked. */
  valuesInline: boolean;
}

/**
 * Configuration for a metadata-type box containing rows of metadata fields.
 */
export interface MetadataBoxConfiguration extends BoxConfiguration {
  /** Unique identifier for this box configuration. */
  id: string;
  /** Array of rows within the metadata box. */
  rows: MetadataBoxRow[];
}

/**
 * Base interface for all box configurations.
 */
export interface BoxConfiguration {
  /** The box type discriminator. */
  type: string;
}

/**
 * Configuration for a relation-type box that displays related items via a discovery search.
 */
export interface RelationBoxConfiguration extends BoxConfiguration {
  /** The discovery configuration name used to find related items. */
  'discovery-configuration': string;
}

/**
 * Configuration for a metrics-type box displaying item-level metrics.
 */
export interface MetricsBoxConfiguration extends BoxConfiguration {
  /** Maximum number of columns for metrics display (null for unlimited). */
  maxColumns: null;
  /** Array of metric type identifiers to display. */
  metrics: string[];
}

/**
 * A cell within a metadata box row, containing layout fields.
 */
export interface MetadataBoxCell {
  /** CSS classes applied to the cell element. */
  style: string;
  /** Array of fields rendered within this cell. */
  fields: LayoutField[];
}

/**
 * A row within a metadata box configuration.
 */
export interface MetadataBoxRow {
  /** CSS classes applied to the row element. */
  style: string;
  /** Array of cells within this row. */
  cells: MetadataBoxCell[];
}

/**
 * Model representing a box in the dynamic layout system.
 *
 * A box is a configurable content container within a tab's cell. It defines what type of
 * content to render (metadata, relations, metrics, collections, IIIF viewer, versioning)
 * and provides styling, security, and collapsibility settings.
 */
export class DynamicLayoutBox {

  /**
   * The numeric identifier of this box.
   */
  id: number;

  /** Short identifier name for this box. */
  shortname: string;

  /** i18n key or plain text for the box header. */
  header: string;

  /** The entity type this box belongs to. */
  entityType: string;

  /** Whether the box starts collapsed. */
  collapsed: boolean;

  /** Whether this box is a minor box (can be filtered out by TabDataService). */
  minor: boolean;

  /** CSS classes applied to the box container. */
  style: string;

  /** Whether to insert a clear element after this box. */
  clear: boolean;

  /** Maximum number of columns for this box's content. */
  maxColumn: number;

  /** Whether this box acts as a container for other elements. */
  container: boolean;

  /** Metadata fields that have security restrictions. */
  metadataSecurityFields?: string[];

  /** Security level required to view this box. */
  security: number;

  /** The box type discriminator (METADATA, RELATION, METRICS, etc.). */
  boxType: string;

  /** Type-specific configuration for the box content. */
  configuration?: RelationBoxConfiguration | MetadataBoxConfiguration | MetricsBoxConfiguration;

}

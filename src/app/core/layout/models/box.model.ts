export interface MetadataGroup {
  leading: string;
  elements: LayoutField[];
}

export interface LayoutBitstream {
  bundle: string;
  metadataField: string;
  metadataValue: string;
}

export enum LayoutFieldType {
  METADATA = 'METADATA',
  METADATAGROUP = 'METADATAGROUP',
  BITSTREAM = 'BITSTREAM'
}

export interface LayoutField {
  metadata?: string;
  bitstream?: LayoutBitstream;
  label?: string;
  rendering: string;
  fieldType: LayoutFieldType | string;
  style?: string;
  styleLabel?: string;
  styleValue?: string;
  metadataGroup?: MetadataGroup;
  labelAsHeading: boolean;
  valuesInline: boolean;
}

export interface MetadataBoxConfiguration extends BoxConfiguration {
  id: string;
  rows: MetadataBoxRow[];
}

export interface BoxConfiguration {
  type: string;
}

export interface RelationBoxConfiguration extends BoxConfiguration {
  'discovery-configuration': string;
}

export interface MetricsBoxConfiguration extends BoxConfiguration {
  maxColumns: null;
  metrics: string[];
}

export interface MetadataBoxCell {
  style: string;
  fields: LayoutField[];
}

export interface MetadataBoxRow {
  style: string;
  cells: MetadataBoxCell[];
}

/**
 * Describes the CrisLayoutBox model
 */
export class CrisLayoutBox {

  /**
   * The identifier of this CrisLayoutBox
   */
  id: number;

  shortname: string;

  header: string;

  entityType: string;

  collapsed: boolean;

  minor: boolean;

  style: string;

  clear: boolean;

  maxColumn: number;

  container: boolean;

  metadataSecurityFields?: string[];

  security: number;

  boxType: string;

  configuration?: RelationBoxConfiguration | MetadataBoxConfiguration | MetricsBoxConfiguration;

}

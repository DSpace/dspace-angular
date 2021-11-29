export interface MetadataGroup {
    leading: string;
    elements: LayoutField[];
}

export interface LayoutBitstream {
    bundle: string;
    metadataField: string;
    metadataValue: string;
}

export interface LayoutField {
    metadata?: string;
    bitstream?: LayoutBitstream;
    label?: string;
    rendering: string;
    fieldType: string;
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
 * Describes the Box model
 */
export class Box {

    /**
     * The identifier of this Box
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

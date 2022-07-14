/**
 * Interface configuration to show/hide advnaced attachment informations
 */
export interface AdvancedAttachmentConfig {
    name: string;
    type: Type;
    truncatable?: boolean;
}

export enum Type {
    Metadata = 'metadata',
    Attribute = 'attribute'
}

/**
 * Interface configuration to select which are the advanced attachment information to show
 */
export interface AdvancedAttachmentConfig {
    name: string;
    type: AdvancedAttachmentElementType;
    truncatable?: boolean;
}

/**
 * Interface configuration to define the type for each element showed in the advanced attachment feature
 */
export enum AdvancedAttachmentElementType {
    Metadata = 'metadata',
    Attribute = 'attribute'
}

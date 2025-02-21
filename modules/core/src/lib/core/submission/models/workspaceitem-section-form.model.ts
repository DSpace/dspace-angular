import { FormFieldMetadataValueObject } from '../../config';
import { MetadataMapInterface } from '../../shared';

/**
 * An interface to represent submission's form section data.
 * A map of metadata keys to an ordered list of FormFieldMetadataValueObject objects.
 */
export interface WorkspaceitemSectionFormObject extends MetadataMapInterface {
  [metadata: string]: FormFieldMetadataValueObject[];
}

import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { MetadataMap } from '../../shared/metadata.interfaces';

export interface WorkspaceitemSectionFormObject extends MetadataMap {
  [metadata: string]: FormFieldMetadataValueObject[];
}

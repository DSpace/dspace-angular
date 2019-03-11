import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { MetadataMapInterface } from '../../shared/metadata.models';

export interface WorkspaceitemSectionFormObject extends MetadataMapInterface {
  [metadata: string]: FormFieldMetadataValueObject[];
}

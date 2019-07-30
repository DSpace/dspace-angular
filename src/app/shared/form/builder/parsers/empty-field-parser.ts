import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DsDynamicEmptyModelConfig, DynamicEmptyModel } from '../ds-dynamic-form-ui/models/empty/dynamic-empty.model';

export class EmptyFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const emptyModelConfig: DsDynamicEmptyModelConfig = this.initModel(null, label);
    return new DynamicEmptyModel(emptyModelConfig)
  }
}

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  DsDynamicTextAreaModel,
  DsDynamicTextAreaModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';

export class TextareaFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const textAreaModelConfig: DsDynamicTextAreaModelConfig = this.initModel(null, label);

    textAreaModelConfig.rows = 10;
    this.setValues(textAreaModelConfig, fieldValue);
    return new DsDynamicTextAreaModel(textAreaModelConfig);
  }
}

import { environment } from '../../../../../environments/environment';
import {
  DsDynamicTextAreaModel,
  DsDynamicTextAreaModelConfig,
} from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FieldParser } from './field-parser';

export class TextareaFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const textAreaModelConfig: DsDynamicTextAreaModelConfig = this.initModel(null, label);

    textAreaModelConfig.rows = 10;
    textAreaModelConfig.spellCheck = environment.form.spellCheck;
    this.setValues(textAreaModelConfig, fieldValue);
    return new DsDynamicTextAreaModel(textAreaModelConfig);
  }
}

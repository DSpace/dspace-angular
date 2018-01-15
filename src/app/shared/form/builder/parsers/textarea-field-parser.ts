import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';

export class TextareaFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject | any): any {
    const inputTextModel: DynamicTextAreaModelConfig = this.initModel();

    let cls: ClsConfig;

    cls = {
      element: {
        label: 'col-form-label'
      }
    };
    const textareaModel = new DynamicTextAreaModel(inputTextModel, cls);
    textareaModel.name = this.fieldId;
    if (isNotEmpty(fieldValue)) {
      textareaModel.value = fieldValue;
      textareaModel.rows = 10;
    }
    return textareaModel;
  }
}

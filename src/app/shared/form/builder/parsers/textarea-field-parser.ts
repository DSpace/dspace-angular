import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';

export class TextareaFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(): any {
    const inputTextModel: DynamicTextAreaModelConfig = this.initModel();
    let cls: ClsConfig;

    cls = {
      element: {
        label: 'col-form-label'
      }
    };
    const textareaModel = new DynamicTextAreaModel(inputTextModel, cls);
    textareaModel.name = this.fieldId;
    return textareaModel;
  }
}

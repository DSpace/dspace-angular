import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';

export class TextareaFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public parse(): any {
    const inputTextModel: DynamicTextAreaModelConfig = this.initModel();
    let cls: ClsConfig;

    cls = {
      element: {
        label: 'col-form-label'
      }
    };
    return new DynamicTextAreaModel(inputTextModel, cls);
  }
}

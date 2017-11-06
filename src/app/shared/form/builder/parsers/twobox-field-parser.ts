import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';

// @TODO to be implemented
export class TwoboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public parse(): any {
    return null;
  }
}

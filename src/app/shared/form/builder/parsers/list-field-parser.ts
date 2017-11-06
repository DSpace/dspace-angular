import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicCheckboxModel, DynamicCheckboxModelConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel, DynamicRadioGroupModel, DynamicRadioGroupModelConfig, DynamicTextAreaModel,
  DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';

export class ListFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public parse(): any {
    if (this.configData.repeatable ) {
      const checkboxModelConfig: DynamicCheckboxModelConfig = this.initModel();
      return new DynamicCheckboxModel(checkboxModelConfig);
    } else {
      const radioModelConfig: DynamicRadioGroupModelConfig<any> = this.initModel();
      return new DynamicRadioGroupModel(radioModelConfig);
    }
  }
}

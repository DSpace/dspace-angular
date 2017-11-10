import { FieldParser } from './field-parser';
import {
  DynamicCheckboxModel, DynamicCheckboxModelConfig,
  DynamicRadioGroupModel, DynamicRadioGroupModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';

export class ListFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public modelFactory(): any {
    if (this.configData.repeatable ) {
      const checkboxModelConfig: DynamicCheckboxModelConfig = this.initModel();
      return new DynamicCheckboxModel(checkboxModelConfig);
    } else {
      const radioModelConfig: DynamicRadioGroupModelConfig<any> = this.initModel();
      return new DynamicRadioGroupModel(radioModelConfig);
    }
  }
}

import { DynamicDatePickerModel, DynamicDatePickerModelConfig } from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';

export class CalendarFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel(null, label);

    inputDateModelConfig.toggleIcon = 'fas fa-calendar';
    this.setValues(inputDateModelConfig as any, fieldValue);

    return new DynamicDatePickerModel(inputDateModelConfig);
  }
}

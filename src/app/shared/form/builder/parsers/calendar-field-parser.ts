import { DynamicDatePickerModel, DynamicDatePickerModelConfig } from '@ng-dynamic-forms/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { dateToNgbDateStruct } from '../../../date.util';
import { isNotEmpty } from '../../../empty.util';
import { DS_DATE_PICKER_SEPARATOR } from '../ds-dynamic-form-ui/models/date-picker/date-picker.component';

export class CalendarFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel(null, label);

    inputDateModelConfig.toggleIcon = 'fas fa-calendar';
    inputDateModelConfig.min = new NgbDate(1900, 1, 1);
    inputDateModelConfig.max = dateToNgbDateStruct();

    let currentDate = fieldValue;
    if (isNotEmpty(fieldValue)) {
      const values = fieldValue.value.split(DS_DATE_PICKER_SEPARATOR);
      currentDate = new NgbDate(parseInt(values[0], 10), parseInt(values[1], 10), parseInt(values[2], 10));
    }

    this.setValues(inputDateModelConfig as any, currentDate);

    return new DynamicDatePickerModel(inputDateModelConfig);
  }
}

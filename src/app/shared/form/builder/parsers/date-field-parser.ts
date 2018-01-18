import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { DynamicDsDatePickerModel } from '../ds-dynamic-form-ui/models/ds-date-picker/ds-date-picker.model';
import { isNotEmpty } from '../../../empty.util';

export class DateFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel();

    inputDateModelConfig.toggleIcon = 'fa fa-calendar';
    /*
    let cls: ClsConfig;
    cls = {
      element: {
        container: 'p-0',
        label: 'col-form-label'
      },
      grid: {
        host: 'col-sm-4'
      }
    };
    const datePickerGroup: DynamicFormGroupModel = Object.create(null);
    datePickerGroup.id = inputDateModelConfig.id + '_group';*/

    // const dateModel = new DynamicDatePickerModel(inputDateModelConfig);
    const dateModel = new DynamicDsDatePickerModel(inputDateModelConfig);
    dateModel.name = this.fieldId;
    if (isNotEmpty(this.getInitGroupValues())) {
      dateModel.valueUpdates.next(this.getInitGroupValues());
    }
    return dateModel;
  }
}

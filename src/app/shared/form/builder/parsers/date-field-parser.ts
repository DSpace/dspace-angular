import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';

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
    const dateModel = new DynamicDatePickerModel(inputDateModelConfig);
    dateModel.name = this.fieldId;
    return dateModel;
  }
}

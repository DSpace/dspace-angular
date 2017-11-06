import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicDatePickerModel, DynamicDatePickerModelConfig,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';

export class DateFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public parse(): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel();
    let cls: ClsConfig;

    inputDateModelConfig.toggleIcon = 'fa fa-calendar';
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
    datePickerGroup.id = inputDateModelConfig.id + '_group';
    datePickerGroup.group = [new DynamicDatePickerModel(inputDateModelConfig, cls)];
    cls = {
      element: {
        control: 'form-row'
      }
    };
    return new DynamicFormGroupModel(datePickerGroup, cls);
  }
}

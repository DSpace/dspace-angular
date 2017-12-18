import {FieldParser} from './field-parser';
import {FormFieldModel} from '../models/form-field.model';
import {FormFieldMetadataValueObject} from "../models/form-field-metadata-value.model";
import {ClsConfig, DynamicFormGroupModel, DynamicInputModel, DynamicInputModelConfig} from "@ng-dynamic-forms/core";
import {DynamicSeriesModel, SERIES_INPUT_1, SERIES_INPUT_2} from "../ds-dynamic-form-ui/models/ds-dynamic-series.model";

// @TODO to be implemented
export class SeriesFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    let clsGroup: ClsConfig;
    let clsInput: ClsConfig;

    clsInput = {
      element: {
        control: 'ds-form-input-value',
      },
      grid: {
        host: 'col-sm-8 pl-0'
      }
    };

    const inputGroup: DynamicFormGroupModel = Object.create(null);
    inputGroup.group = [];

    const input1ModelConfig: DynamicInputModelConfig = this.initModel(SERIES_INPUT_1, true, false);
    const input2ModelConfig: DynamicInputModelConfig = this.initModel(SERIES_INPUT_2, false, true);

    inputGroup.group.push(new DynamicInputModel(input1ModelConfig, clsInput));
    inputGroup.group.push(new DynamicInputModel(input2ModelConfig, clsInput));

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    return new DynamicSeriesModel(inputGroup, clsGroup);
  }
}

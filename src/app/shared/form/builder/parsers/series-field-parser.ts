import {FieldParser} from './field-parser';
import {FormFieldModel} from '../models/form-field.model';
import {FormFieldMetadataValueObject} from "../models/form-field-metadata-value.model";
import {ClsConfig, DynamicFormGroupModel, DynamicInputModel, DynamicInputModelConfig} from "@ng-dynamic-forms/core";
import {
  DynamicSeriesModel, SERIES_GROUP_SUFFIX, SERIES_INPUT_1_SUFFIX, SERIES_INPUT_2_SUFFIX
} from "../ds-dynamic-form-ui/models/ds-dynamic-series.model";

// @TODO to be implemented
export class SeriesFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {

    let clsGroup: ClsConfig;
    let clsInput: ClsConfig;
    const newId = this.configData.selectableMetadata[0].metadata
      .split('.')
      .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
      .join('.');

    clsInput = {
      grid: {
        host: 'col-sm-6'
      }
    };

    const inputGroup: DynamicFormGroupModel = Object.create(null);
    inputGroup.id = newId.replace(/\./g, '_') + SERIES_GROUP_SUFFIX;
    inputGroup.group = [];

    const input1ModelConfig: DynamicInputModelConfig = this.initModel(newId + SERIES_INPUT_1_SUFFIX, true, false);
    const input2ModelConfig: DynamicInputModelConfig = this.initModel(newId + SERIES_INPUT_2_SUFFIX, true, true);

    // values
    if (fieldValue && fieldValue.value && fieldValue.value.length > 0) {
      const values = fieldValue.value.split(';');

      if (values.length > 1) {
        input1ModelConfig.value = values[0];
        input1ModelConfig.value = values[1];
      }
    }


    let model1 = new DynamicInputModel(input1ModelConfig, clsInput);
    let model2 = new DynamicInputModel(input2ModelConfig, clsInput);
    model1.name = this.getFieldId()[0];
    model2.name = this.getFieldId()[0];
    inputGroup.group.push(model1);
    inputGroup.group.push(model2);

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    return new DynamicSeriesModel(inputGroup, clsGroup);
  }

}

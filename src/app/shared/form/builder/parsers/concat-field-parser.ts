import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { ClsConfig, DynamicInputModel, DynamicInputModelConfig } from '@ng-dynamic-forms/core';
import {
  CONCAT_FIRST_INPUT_SUFFIX,
  CONCAT_GROUP_SUFFIX, CONCAT_SECOND_INPUT_SUFFIX,
  DynamicConcatModel, DynamicConcatModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { isNotEmpty } from '../../../empty.util';

export class ConcatFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, private separator: string) {
    super(configData, initFormValues);

    this.separator = separator;
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

    const concatGroup: DynamicConcatModelConfig = Object.create(null);
    concatGroup.id = newId.replace(/\./g, '_') + CONCAT_GROUP_SUFFIX;
    concatGroup.group = [];
    concatGroup.separator = this.separator;

    const input1ModelConfig: DynamicInputModelConfig = this.initModel(newId + CONCAT_FIRST_INPUT_SUFFIX, true, false);
    const input2ModelConfig: DynamicInputModelConfig = this.initModel(newId + CONCAT_SECOND_INPUT_SUFFIX, true, true);

    // Init values
    if (isNotEmpty(fieldValue)) {
      const  values = fieldValue.value.split(this.separator);

      if (values.length > 1) {
        input1ModelConfig.value = values[0];
        input2ModelConfig.value = values[1];
      }
    }

    // Split placeholder if is like 'placeholder1/placeholder2'
    const placeholder = this.configData.label.split('/');
    if (placeholder.length === 2) {
      input1ModelConfig.placeholder = placeholder[0];
      input2ModelConfig.placeholder = placeholder[1];
    }

    const model1 = new DynamicInputModel(input1ModelConfig, clsInput);
    const model2 = new DynamicInputModel(input2ModelConfig, clsInput);
    // TODO remove when merge https://github.com/udos86/ng-dynamic-forms/commit/cadd7e3ac9ffdbb550900bd2bd06764d7f7abfb1
    model1.name = this.getFieldId()[0];
    model2.name = this.getFieldId()[0];
    concatGroup.group.push(model1);
    concatGroup.group.push(model2);

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    return new DynamicConcatModel(concatGroup, clsGroup);
  }

}

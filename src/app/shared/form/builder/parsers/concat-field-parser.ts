import { DynamicFormControlLayout, DynamicInputModel, DynamicInputModelConfig } from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import { ParserOptions } from './parser-options';
import { isNotEmpty } from '../../../empty.util';
import {
  CONCAT_FIRST_INPUT_SUFFIX,
  CONCAT_GROUP_SUFFIX,
  CONCAT_SECOND_INPUT_SUFFIX,
  DynamicConcatModel,
  DynamicConcatModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';

export class ConcatFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected parserOptions: ParserOptions,
              protected separator: string,
              protected firstPlaceholder: string = null,
              protected secondPlaceholder: string = null) {
    super(configData, initFormValues, parserOptions);

    this.separator = separator;
    this.firstPlaceholder = firstPlaceholder;
    this.secondPlaceholder = secondPlaceholder;
  }

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {

    let clsGroup: DynamicFormControlLayout;
    let clsInput: DynamicFormControlLayout;
    let newId: string;

    if (this.configData.selectableMetadata[0].metadata.includes('.')) {
      newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');
    } else {
      newId = this.configData.selectableMetadata[0].metadata
    }

    clsInput = {
      grid: {
        host: 'col-sm-6'
      }
    };

    const groupId = newId.replace(/\./g, '_') + CONCAT_GROUP_SUFFIX;
    const concatGroup: DynamicConcatModelConfig = this.initModel(groupId, false, false);

    concatGroup.group = [];
    concatGroup.separator = this.separator;

    const input1ModelConfig: DynamicInputModelConfig = this.initModel(newId + CONCAT_FIRST_INPUT_SUFFIX, label, false, false);
    const input2ModelConfig: DynamicInputModelConfig = this.initModel(newId + CONCAT_SECOND_INPUT_SUFFIX, label, true, false);

    if (this.configData.mandatory) {
      input1ModelConfig.required = true;
    }

    if (isNotEmpty(this.firstPlaceholder)) {
      input1ModelConfig.placeholder = this.firstPlaceholder;
    }

    if (isNotEmpty(this.secondPlaceholder)) {
      input2ModelConfig.placeholder = this.secondPlaceholder;
    }

    // Init values
    if (isNotEmpty(fieldValue)) {
      const values = fieldValue.value.split(this.separator);

      if (values.length > 1) {
        input1ModelConfig.value = values[0].trim();
        input2ModelConfig.value = values[1].trim();
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
    concatGroup.group.push(model1);
    concatGroup.group.push(model2);

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    const concatModel = new DynamicConcatModel(concatGroup, clsGroup);
    concatModel.name = this.getFieldId();

    return concatModel;
  }

}

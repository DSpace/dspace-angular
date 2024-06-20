import { Inject } from '@angular/core';
import { FormFieldModel } from '../models/form-field.model';
import { CONFIG_DATA, FieldParser, INIT_FORM_VALUES, PARSER_OPTIONS, SUBMISSION_ID } from './field-parser';
import { ParserOptions } from './parser-options';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicFormControlLayout, DynamicInputModel } from '@ng-dynamic-forms/core';
import { hasNoValue, hasValue, isNotEmpty } from '../../../empty.util';
import {
  DsDynamicAutocompleteModel,
  DsDynamicAutocompleteModelConfig
} from '../ds-dynamic-form-ui/models/autocomplete/ds-dynamic-autocomplete.model';
import {
  CLARIN_NAME_FIRST_INPUT_SUFFIX,
  CLARIN_NAME_GROUP_SUFFIX, CLARIN_NAME_SECOND_INPUT_SUFFIX, DsDynamicClarinNameModelConfig,
  DynamicClarinNameModel
} from '../ds-dynamic-form-ui/models/clarin-name.model';
import { DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';

/**
 * Parser where is created DynamicClarinNameModel for the `author` input field.
 */
export class ClarinNameFieldParser extends FieldParser {

  constructor(
    @Inject(SUBMISSION_ID) submissionId: string,
    @Inject(CONFIG_DATA) configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) initFormValues,
    @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
    protected separator: string,
    protected firstPlaceholder: string = 'form.last-name',
    protected secondPlaceholder: string = 'form.first-name') {
    super(submissionId, configData, initFormValues, parserOptions);
    this.separator = separator;
  }

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {

    let clsGroup: DynamicFormControlLayout;
    let clsInput: DynamicFormControlLayout;
    const id: string = this.configData.selectableMetadata[0].metadata;

    clsInput = {
      grid: {
        host: 'col-sm-6'
      }
    };

    const groupId = id.replace(/\./g, '_') + CLARIN_NAME_GROUP_SUFFIX;
    const clarinNameGroup: DsDynamicClarinNameModelConfig = this.initModel(groupId, label, false, true);

    clarinNameGroup.group = [];
    clarinNameGroup.separator = this.separator;

    const input1ModelConfig: DsDynamicAutocompleteModelConfig = this.initModel(
      id + CLARIN_NAME_FIRST_INPUT_SUFFIX,
      false,
      true,
      true,
      false
    );
    const input2ModelConfig: DsDynamicInputModelConfig = this.initModel(
      id + CLARIN_NAME_SECOND_INPUT_SUFFIX,
      false,
      true,
      true,
      false
    );

    if (hasNoValue(clarinNameGroup.hint) && hasValue(input1ModelConfig.hint) && hasNoValue(input2ModelConfig.hint)) {
      clarinNameGroup.hint = input1ModelConfig.hint;
      input1ModelConfig.hint = undefined;
    }

    if (this.configData.mandatory) {
      clarinNameGroup.required = true;
      input1ModelConfig.required = true;
    }

    if (isNotEmpty(this.firstPlaceholder)) {
      input1ModelConfig.placeholder = this.firstPlaceholder;
    }

    if (isNotEmpty(this.secondPlaceholder)) {
      input2ModelConfig.placeholder = this.secondPlaceholder;
    }

    // Split placeholder if is like 'placeholder1/placeholder2'
    const placeholder = this.configData.label.split('/');
    if (placeholder.length === 2) {
      input1ModelConfig.placeholder = placeholder[0];
      input2ModelConfig.placeholder = placeholder[1];
    }

    const model1 = new DsDynamicAutocompleteModel(input1ModelConfig, clsInput);
    const model2 = new DynamicInputModel(input2ModelConfig, clsInput);
    clarinNameGroup.group.push(model1);
    clarinNameGroup.group.push(model2);

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    const clarinNameModel = new DynamicClarinNameModel(clarinNameGroup, clsGroup);
    clarinNameModel.name = this.getFieldId();

    // Init values
    if (isNotEmpty(fieldValue)) {
      clarinNameModel.value = fieldValue;
    }

    return clarinNameModel;
  }
}

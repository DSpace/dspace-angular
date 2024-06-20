import { Inject } from '@angular/core';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import {
  DynamicFormControlLayout,
} from '@ng-dynamic-forms/core';
import {
  COMPLEX_GROUP_SUFFIX,
  COMPLEX_INPUT_SUFFIX,
  DynamicComplexModel,
  DynamicComplexModelConfig,
  OPENAIRE_INPUT_NAME,
  SPONSOR_METADATA_NAME,

} from '../ds-dynamic-form-ui/models/ds-dynamic-complex.model';
import { hasValue, isNotEmpty, isUndefined } from '../../../empty.util';
import { ParserOptions } from './parser-options';
import {
  CONFIG_DATA,
  FieldParser,
  INIT_FORM_VALUES,
  PARSER_OPTIONS,
  SUBMISSION_ID
} from './field-parser';
import {
  DsDynamicAutocompleteModel,
} from '../ds-dynamic-form-ui/models/autocomplete/ds-dynamic-autocomplete.model';
import { ParserType } from './parser-type';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DsDynamicSponsorAutocompleteModel } from '../ds-dynamic-form-ui/models/sponsor-autocomplete/ds-dynamic-sponsor-autocomplete.model';

/**
 * The parser which parse DynamicComplexModelConfig configuration to the DynamicComplexModel.
 */
export class ComplexFieldParser extends FieldParser {

  constructor(
    @Inject(SUBMISSION_ID) submissionId: string,
    @Inject(CONFIG_DATA) configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) initFormValues,
    @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
    protected separator: string,
    protected placeholders: string[]) {
    super(submissionId, configData, initFormValues, parserOptions);
    this.separator = separator;
  }

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {

    let clsGroup: DynamicFormControlLayout;
    let clsInput: DynamicFormControlLayout;
    const id: string = this.configData.selectableMetadata[0].metadata;

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };

    clsInput = {
      grid: {
        host: 'col-sm-12'
      }
    };

    const groupId = id.replace(/\./g, '_') + COMPLEX_GROUP_SUFFIX;
    const concatGroup: DynamicComplexModelConfig = this.initModel(groupId, label, false, true);

    concatGroup.group = [];
    concatGroup.separator = this.separator;

    let inputConfigs: DsDynamicInputModelConfig[];
    inputConfigs = [];

    const complexDefinitionJSON = JSON.parse(this.configData.complexDefinition);

    Object.keys(complexDefinitionJSON).forEach((input, index) => {
      inputConfigs.push(this.initModel(
        id + COMPLEX_INPUT_SUFFIX + index,
        false,
        true,
        true,
        false
      ));
    });

    if (this.configData.mandatory) {
      concatGroup.required = true;
    }

    inputConfigs.forEach((inputConfig, index) => {
      let complexDefinitionInput = complexDefinitionJSON[index];
      complexDefinitionInput = complexDefinitionInput[Object.keys(complexDefinitionInput)[0]];

      if (hasValue(complexDefinitionInput.label)) {
        inputConfig.label = complexDefinitionInput.label;
        inputConfig.placeholder = complexDefinitionInput.label;
      }

      if (hasValue(complexDefinitionInput.placeholder)) {
        inputConfig.placeholder = complexDefinitionInput.placeholder;
      }

      if (hasValue(complexDefinitionInput.hint)) {
        inputConfig.hint = complexDefinitionInput.hint;
      }

      if (hasValue(complexDefinitionInput.style)) {
        clsInput = {
          grid: {
            host: complexDefinitionInput.style
          }
        };
      }

      if (hasValue(complexDefinitionInput.readonly) && complexDefinitionInput.readonly === 'true') {
        inputConfig.readOnly = true;
      }

      inputConfig.required = hasValue(complexDefinitionInput.required) && complexDefinitionInput.required === 'true';

      // max length - 200 chars
      this.addValidatorToComplexInput(inputConfig, complexDefinitionInput);

      let inputModel: DsDynamicInputModel;
      switch (complexDefinitionInput['input-type']) {
        case ParserType.Onebox:
          inputModel = new DsDynamicInputModel(inputConfig, clsInput);
          break;
        case ParserType.Dropdown:
          this.setVocabularyOptionsInComplexInput(inputConfig, complexDefinitionInput);
          inputModel = new DynamicScrollableDropdownModel(inputConfig as DynamicScrollableDropdownModelConfig,
            clsInput);
          break;
        case ParserType.Autocomplete:
          if (id === SPONSOR_METADATA_NAME) {
            inputModel = new DsDynamicSponsorAutocompleteModel(inputConfig, clsInput);
          } else {
            inputModel = new DsDynamicAutocompleteModel(inputConfig, clsInput);
          }
          break;
        default:
          inputModel = new DsDynamicInputModel(inputConfig, clsInput);
          break;
      }

      // for non-EU funds hide EU identifier read only input field
      inputModel.hidden = complexDefinitionInput.name === OPENAIRE_INPUT_NAME;

      // Show error messages in the input field. It is ignored in the `initForm` because a whole input group is not
      // required. It should be marked as required in the complex group for every input field.
      if (inputConfig.required) {
        this.markAsRequired(inputModel);
      }
      concatGroup.group.push(inputModel);
    });

    const complexModel = new DynamicComplexModel(concatGroup, clsGroup);
    complexModel.name = this.getFieldId();

    // Init values
    if (isNotEmpty(fieldValue)) {
      complexModel.value = fieldValue;
    }

    return complexModel;
  }

  addValidatorToComplexInput(inputConfig, complexDefinitionInput) {
    let regex;
    if (isUndefined(complexDefinitionInput.regex)) {
      // default max length 200 chars
      regex = new RegExp('^.{1,200}$');
    } else {
      // take regex from definition e.g., email
      regex = new RegExp(complexDefinitionInput.regex);
    }

    inputConfig.validators = Object.assign({}, inputConfig.validators, { pattern: regex });
    inputConfig.errorMessages = Object.assign(
      {},
      inputConfig.errorMessages,
      { pattern: 'error.validation.pattern' });
  }
}

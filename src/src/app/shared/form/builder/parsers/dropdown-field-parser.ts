import { Inject } from '@angular/core';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';

import { isNotEmpty } from '../../../empty.util';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig,
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  CONFIG_DATA,
  FieldParser,
  INIT_FORM_VALUES,
  PARSER_OPTIONS,
  SUBMISSION_ID,
} from './field-parser';
import { ParserOptions } from './parser-options';

export class DropdownFieldParser extends FieldParser {

  constructor(
    @Inject(SUBMISSION_ID) submissionId: string,
    @Inject(CONFIG_DATA) configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) initFormValues,
    @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
      translate: TranslateService,
  ) {
    super(submissionId, configData, initFormValues, parserOptions, translate);
  }

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel(null, label);
    let layout: DynamicFormControlLayout;

    if (isNotEmpty(this.configData.selectableMetadata[0].controlledVocabulary)) {
      this.setVocabularyOptions(dropdownModelConfig);
      if (isNotEmpty(fieldValue)) {
        dropdownModelConfig.value = fieldValue;
      }
      layout = {
        element: {
          control: 'col',
        },
        grid: {
          host: 'col',
        },
      };
      const dropdownModel = new DynamicScrollableDropdownModel(dropdownModelConfig, layout);
      return dropdownModel;
    } else {
      throw  Error(`Controlled Vocabulary name is not available. Please check the form configuration file.`);
    }
  }
}

import { FieldParser } from './field-parser';
import { DynamicFormControlLayout, } from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { isNotEmpty } from '../../../empty.util';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';

export class DropdownFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel();
    let layout: DynamicFormControlLayout;

    if (isNotEmpty(this.configData.selectableMetadata[0].authority)) {
      dropdownModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      dropdownModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      dropdownModelConfig.authorityScope = this.authorityUuid;
      dropdownModelConfig.maxOptions = 10;
      if (isNotEmpty(fieldValue)) {
        dropdownModelConfig.value = fieldValue;
      }
      layout = {
        element: {
          control: 'col'
        },
        grid: {
          host: 'col'
        }
      };
      const dropdownModel = new DynamicScrollableDropdownModel(dropdownModelConfig, layout);
      return dropdownModel;
    } else {
      throw  Error(`Authority name is not available. Please checks form configuration file.`);
    }
  }
}

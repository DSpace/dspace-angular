import {
  ClsConfig,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicInputModelConfig,
  DynamicSelectModel,
  DynamicSelectModelConfig
} from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import {
  COMBOBOX_GROUP_SUFFIX,
  COMBOBOX_METADATA_SUFFIX,
  COMBOBOX_VALUE_SUFFIX,
  DynamicComboboxModel
} from '../ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import {
  DsDynamicTypeaheadModelConfig,
  DynamicTypeaheadModel
} from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';

export class OneboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject | any): any {
    if (this.configData.selectableMetadata.length > 1) {
      let clsGroup: ClsConfig;
      let clsSelect: ClsConfig;
      let clsInput: ClsConfig;
      const newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');

      const inputSelectGroup: DynamicFormGroupModel = Object.create(null);
      inputSelectGroup.id = newId.replace(/\./g, '_') + COMBOBOX_GROUP_SUFFIX;
      inputSelectGroup.group = [];
      inputSelectGroup.legend = this.configData.label;

      const selectModelConfig: DynamicSelectModelConfig<any> = this.initModel(  newId + COMBOBOX_METADATA_SUFFIX);
      this.setOptions(selectModelConfig);
      if (isNotEmpty(fieldValue)) {
        selectModelConfig.value = fieldValue.metadata;
      }
      clsSelect = {
        element: {
          control: 'input-group-addon ds-form-input-addon',
        },
        grid: {
          host: 'col-sm-4 pr-0'
        }
      };
      inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, clsSelect));

      const inputModelConfig: DynamicInputModelConfig = this.initModel(newId + COMBOBOX_VALUE_SUFFIX, true, true);
      if (isNotEmpty(fieldValue)) {
        inputModelConfig.value = fieldValue.value;
      }
      clsInput = {
        element: {
          control: 'ds-form-input-value',
        },
        grid: {
          host: 'col-sm-8 pl-0'
        }
      };
      inputSelectGroup.group.push(new DynamicInputModel(inputModelConfig, clsInput));

      clsGroup = {
        element: {
          control: 'form-row',
        }
      };
      return new DynamicComboboxModel(inputSelectGroup, clsGroup);
    } else if (this.configData.selectableMetadata[0].authority) {
      const typeaheadModelConfig: DsDynamicTypeaheadModelConfig = this.initModel();
      typeaheadModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      typeaheadModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      typeaheadModelConfig.authorityScope = this.authorityUuid;
      if (isNotEmpty(fieldValue)) {
        // If value isn't an instance of AuthorityModel instantiate it
        if (fieldValue instanceof AuthorityModel) {
          typeaheadModelConfig.value = fieldValue;
        } else {
          const authorityValue: AuthorityModel = new AuthorityModel();
          authorityValue.value = fieldValue;
          authorityValue.display = fieldValue;
          typeaheadModelConfig.value = authorityValue;
        }
      }
      typeaheadModelConfig.minChars = 3;
      const typeaheadModel = new DynamicTypeaheadModel(typeaheadModelConfig);
      typeaheadModel.name = this.fieldId;
      return typeaheadModel;
    } else {
      const inputModelConfig: DsDynamicInputModelConfig = this.initModel();
      const inputModel = new DsDynamicInputModel(inputModelConfig);
      inputModel.name = this.fieldId;
      if (isNotEmpty(fieldValue)) {
        inputModel.value = fieldValue;
      }
      inputModel.languageUpdates.next({code:'en_US', display: 'English'}); // TODO TO REMOVE
      return inputModel;
    }
  }
}

import { DynamicSelectModel, DynamicSelectModelConfig } from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import {
  COMBOBOX_GROUP_SUFFIX,
  COMBOBOX_METADATA_SUFFIX,
  COMBOBOX_VALUE_SUFFIX,
  DsDynamicComboboxModelConfig,
  DynamicComboboxModel
} from '../ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import {
  DsDynamicTypeaheadModelConfig,
  DynamicTypeaheadModel
} from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';

export class OneboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected readOnly: boolean,
              protected authorityUuid: string) {
    super(configData, initFormValues, readOnly);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    if (this.configData.selectableMetadata.length > 1) {
      // Case ComboBox
      const clsGroup = {
        element: {
          control: 'form-row',
        }
      };

      const clsSelect = {
        element: {
          control: 'input-group-addon ds-form-input-addon',
        },
        grid: {
          host: 'col-sm-4 pr-0'
        }
      };

      const clsInput = {
        element: {
          control: 'ds-form-input-value',
        },
        grid: {
          host: 'col-sm-8 pl-0'
        }
      };

      const newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');

      const inputSelectGroup: DsDynamicComboboxModelConfig = Object.create(null);
      inputSelectGroup.id = newId.replace(/\./g, '_') + COMBOBOX_GROUP_SUFFIX;
      inputSelectGroup.group = [];
      inputSelectGroup.legend = this.configData.label;

      const selectModelConfig: DynamicSelectModelConfig<any> = this.initModel(newId + COMBOBOX_METADATA_SUFFIX);
      this.setOptions(selectModelConfig);
      if (isNotEmpty(fieldValue)) {
        selectModelConfig.value = fieldValue.metadata;
      }
      selectModelConfig.disabled = true;
      inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, clsSelect));

      const inputModelConfig: DsDynamicInputModelConfig = this.initModel(newId + COMBOBOX_VALUE_SUFFIX, true, true);
      this.setValues(inputModelConfig, fieldValue);

      inputSelectGroup.readOnly = selectModelConfig.disabled && inputModelConfig.readOnly;
      inputSelectGroup.group.push(new DsDynamicInputModel(inputModelConfig, clsInput));

      return new DynamicComboboxModel(inputSelectGroup, clsGroup);
    } else if (this.configData.selectableMetadata[0].authority) {
      const typeaheadModelConfig: DsDynamicTypeaheadModelConfig = this.initModel();
      this.setAuthorityOptions(typeaheadModelConfig, this.authorityUuid);
      this.setValues(typeaheadModelConfig, fieldValue, true);
      typeaheadModelConfig.minChars = 3;
      const typeaheadModel = new DynamicTypeaheadModel(typeaheadModelConfig);
      return typeaheadModel;
    } else {
      const inputModelConfig: DsDynamicInputModelConfig = this.initModel();
      this.setValues(inputModelConfig, fieldValue);
      const inputModel = new DsDynamicInputModel(inputModelConfig);
      return inputModel;
    }
  }
}

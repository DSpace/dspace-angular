import {
  ClsConfig,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicInputModelConfig,
  DynamicSelectModel,
  DynamicSelectModelConfig
} from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import {
  DynamicTypeaheadModel, DynamicTypeaheadModelConfig
} from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { FormFieldModel } from '../models/form-field.model';
import {
  COMBOBOX_METADATA_SUFFIX, COMBOBOX_VALUE_SUFFIX,
  DynamicComboboxModel
} from '../ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';

export class OneboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    if (this.configData.selectableMetadata.length > 1) {
      let clsGroup: ClsConfig;
      let clsSelect: ClsConfig;
      let clsInput: ClsConfig;
      const newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');

      const inputSelectGroup: DynamicFormGroupModel = Object.create(null);
      inputSelectGroup.id = newId.replace(/\./g, '_') + '_group';
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
      const typeaheadModelConfig: DynamicTypeaheadModelConfig = this.initModel();
      typeaheadModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      typeaheadModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      typeaheadModelConfig.authorityScope = this.authorityUuid;
      if (isNotEmpty(fieldValue)) {
        const authorityValue = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
        typeaheadModelConfig.value = authorityValue;
      }
      typeaheadModelConfig.minChars = 3;
      const typeaheadModel = new DynamicTypeaheadModel(typeaheadModelConfig);
      typeaheadModel.name = this.fieldId;
      return typeaheadModel;
    } else {
      const inputModelConfig: DynamicInputModelConfig = this.initModel();
      const inputModel = new DynamicInputModel(inputModelConfig);
      inputModel.name = this.fieldId;
      if (isNotEmpty(fieldValue)) {
        inputModel.value = fieldValue.value;
      }
      return inputModel;
    }
  }
}

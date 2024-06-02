import {
  DynamicSelectModel,
  DynamicSelectModelConfig,
} from '@ng-dynamic-forms/core';

import { isNotEmpty } from '../../../empty.util';
import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import {
  DsDynamicQualdropModelConfig,
  DynamicQualdropModel,
  QUALDROP_GROUP_SUFFIX,
  QUALDROP_METADATA_SUFFIX,
  QUALDROP_VALUE_SUFFIX,
} from '../ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import {
  DsDynamicOneboxModelConfig,
  DynamicOneboxModel,
} from '../ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FieldParser } from './field-parser';

export class OneboxFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    if (this.configData.selectableMetadata.length > 1) {
      // Case Qualdrop Model
      const clsGroup = {
        element: {
          control: 'form-row',
          hint: 'ds-form-qualdrop-hint',
        },
      };

      const clsSelect = {
        element: {
          control: 'ds-form-input-addon custom-select',
        },
        grid: {
          host: 'col-sm-4 pr-0',
        },
      };

      const clsInput = {
        element: {
          control: 'ds-form-input-value',
        },
        grid: {
          host: 'col-sm-8 pl-0',
        },
      };

      const newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');

      const inputSelectGroup: DsDynamicQualdropModelConfig = Object.create(null);
      inputSelectGroup.id = newId.replace(/\./g, '_') + QUALDROP_GROUP_SUFFIX;
      inputSelectGroup.group = [];
      inputSelectGroup.legend = this.configData.label;
      inputSelectGroup.hint = this.configData.hints;
      this.setLabel(inputSelectGroup, label);
      inputSelectGroup.required = isNotEmpty(this.configData.mandatory);

      const inputModelConfig: DsDynamicInputModelConfig = this.initModel(newId + QUALDROP_VALUE_SUFFIX, label, false, false);
      inputModelConfig.hint = null;
      this.setValues(inputModelConfig, fieldValue);

      const selectModelConfig: DynamicSelectModelConfig<any> = this.initModel(newId + QUALDROP_METADATA_SUFFIX, label, false, false);
      selectModelConfig.hint = null;
      this.setOptions(selectModelConfig);
      if (isNotEmpty(fieldValue)) {
        selectModelConfig.value = fieldValue.metadata;
      }
      selectModelConfig.disabled = inputModelConfig.readOnly;
      inputSelectGroup.readOnly = selectModelConfig.disabled && inputModelConfig.readOnly;

      inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, clsSelect));
      inputSelectGroup.group.push(new DsDynamicInputModel(inputModelConfig, clsInput));

      return new DynamicQualdropModel(inputSelectGroup, clsGroup);
    } else if (this.configData.selectableMetadata[0].controlledVocabulary) {
      const oneboxModelConfig: DsDynamicOneboxModelConfig = this.initModel(null, label);
      this.setVocabularyOptions(oneboxModelConfig);
      this.setValues(oneboxModelConfig, fieldValue, true);

      return new DynamicOneboxModel(oneboxModelConfig);
    } else {
      const inputModelConfig: DsDynamicInputModelConfig = this.initModel(null, label);
      this.setValues(inputModelConfig, fieldValue);

      return new DsDynamicInputModel(inputModelConfig);
    }
  }
}

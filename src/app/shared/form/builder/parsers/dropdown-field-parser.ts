import { FieldParser } from './field-parser';
import {
  ClsConfig,
  DynamicFormGroupModel,
} from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { isNotEmpty } from '../../../empty.util';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';

export class DropdownFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel();
    let cls: ClsConfig;

    if (isNotEmpty(this.configData.selectableMetadata[ 0 ].authority)) {
      dropdownModelConfig.authorityMetadata = this.configData.selectableMetadata[ 0 ].metadata;
      dropdownModelConfig.authorityName = this.configData.selectableMetadata[ 0 ].authority;
      dropdownModelConfig.authorityScope = this.authorityUuid;
      dropdownModelConfig.maxOptions = 10;
      if (isNotEmpty(fieldValue)) {
        dropdownModelConfig.value = fieldValue;
      }
      cls = {
        element: {
          control: 'col'
        },
        grid: {
          host: 'col'
        }
      };
      const dropdownMpdel = new DynamicScrollableDropdownModel(dropdownModelConfig, cls);
      dropdownMpdel.name = this.fieldId;
      return dropdownMpdel;
    } else {
      throw  Error(`Authority name is not available. Please checks form configuration file.`);
    }
  }
}

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
        const authorityValue = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
        dropdownModelConfig.value = authorityValue;
      }
      cls = {
        element: {
          control: 'col'
        },
        grid: {
          host: 'col'
        }
      };
      const dropdownGroup: DynamicFormGroupModel = Object.create(null);
      dropdownGroup.id = dropdownModelConfig.id + '_group';
      dropdownGroup.group = [ new DynamicScrollableDropdownModel(dropdownModelConfig, cls) ];
      dropdownGroup.group[ 0 ].name = this.fieldId;

      cls = {
        element: {
          control: 'form-row'
        }
      };
      return new DynamicFormGroupModel(dropdownGroup, cls);
    } else {
      return null;
      // throw  Error(`Authority name is not available. Please checks form configuration file.`);
    }
  }
}

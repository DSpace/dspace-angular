import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import {DynamicScrollableDropdownModelConfig} from "../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model";
import {
  DynamicTypeaheadModel,
  DynamicTypeaheadModelConfig
} from "../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model";
import {AuthorityModel} from "../../../../core/integration/models/authority.model";

export class TagFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
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
  }
}

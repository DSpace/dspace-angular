import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { isNotEmpty } from '../../../empty.util';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';
import {
  DynamicListCheckboxGroupModel,
  DynamicListCheckboxGroupModelConfig
} from '../ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';

export class ListFieldParser extends FieldParser {
  searchOptions: IntegrationSearchOptions;

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const listModelConfig = this.initModel();
    listModelConfig.repeatable = this.configData.repeatable;

    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0) {

      if (isNotEmpty(this.getInitGroupValues())) {
        listModelConfig.storedValue = this.getInitGroupValues();
      }
      listModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      listModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      listModelConfig.authorityScope = this.authorityUuid;
    }

    let listModel;
    if (listModelConfig.repeatable) {
      listModelConfig.group = [];
      listModel = new DynamicListCheckboxGroupModel(listModelConfig);
    } else {
      listModelConfig.options = []
      listModel = new DynamicListRadioGroupModel(listModelConfig);
    }
    listModel.name = this.getFieldId()[0];

    return listModel;
  }

}

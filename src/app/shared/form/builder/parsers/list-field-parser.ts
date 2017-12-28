import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { isNotEmpty } from '../../../empty.util';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';
import { DynamicListModel, DynamicListModelConfig } from '../ds-dynamic-form-ui/models/list/dynamic-list.model';
import { DynamicCheckboxGroupModel, DynamicCheckboxModel } from '@ng-dynamic-forms/core';

export class ListFieldParser extends FieldParser {
  searchOptions: IntegrationSearchOptions;

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const listModelConfig: DynamicListModelConfig = this.initModel();
    listModelConfig.repeatable = this.configData.repeatable;

    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0) {

      if (isNotEmpty(fieldValue)) {
        listModelConfig.value = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
      }
    }
    listModelConfig.group = [];
    listModelConfig.group.push(new DynamicCheckboxModel({id: 'one', label: 'one'}));
    listModelConfig.group.push(new DynamicCheckboxModel({id: 'two', label: 'two'}));
    const listModel = new DynamicListModel(listModelConfig);
    // const listModel = new DynamicCheckboxGroupModel(listModelConfig);
    listModel.name = this.getFieldId()[0];
    /*listModel.authorityMetadata = this.configData.selectableMetadata[0].metadata;
    listModel.authorityName = this.configData.selectableMetadata[0].authority;
    listModel.authorityScope = this.authorityUuid;*/

    /*this.searchOptions = new IntegrationSearchOptions(
      listModel.authorityScope,
      listModel.authorityName,
      listModel.authorityMetadata);*/

    return listModel;
  }

}

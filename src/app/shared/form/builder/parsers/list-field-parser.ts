import { FieldParser } from './field-parser';
import { isNotEmpty } from '../../../empty.util';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicListCheckboxGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';

export class ListFieldParser extends FieldParser {
  searchOptions: IntegrationSearchOptions;

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const listModelConfig = this.initModel(null, label);
    listModelConfig.repeatable = this.configData.repeatable;

    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0) {

      if (isNotEmpty(this.getInitGroupValues())) {
        listModelConfig.value = [];
        this.getInitGroupValues().forEach((value: any) => {
          if (value instanceof FormFieldMetadataValueObject) {
            listModelConfig.value.push(value);
          } else {
            const valueObj = new FormFieldMetadataValueObject(value);
            listModelConfig.value.push(valueObj);
          }
        });
      }
      this.setAuthorityOptions(listModelConfig, this.parserOptions.authorityUuid);
    }

    let listModel;
    if (listModelConfig.repeatable) {
      listModelConfig.group = [];
      listModel = new DynamicListCheckboxGroupModel(listModelConfig);
    } else {
      listModelConfig.options = [];
      listModel = new DynamicListRadioGroupModel(listModelConfig);
    }

    return listModel;
  }

}

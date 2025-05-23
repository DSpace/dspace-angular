import { isNotEmpty } from '../../../empty.util';
import { DynamicListCheckboxGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from '../ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FieldParser } from './field-parser';

export class ListFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const listModelConfig = this.initModel(null, label);
    listModelConfig.repeatable = this.configData.repeatable;

    if (this.configData.selectableMetadata[0].controlledVocabulary
      && this.configData.selectableMetadata[0].controlledVocabulary.length > 0) {

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
      this.setVocabularyOptions(listModelConfig);
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

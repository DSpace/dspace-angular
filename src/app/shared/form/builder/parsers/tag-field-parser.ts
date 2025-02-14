import {
  DynamicTagModel,
  DynamicTagModelConfig,
} from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FieldParser } from './field-parser';

export class TagFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const tagModelConfig: DynamicTagModelConfig = this.initModel(null, label);
    if (this.configData.selectableMetadata[0].controlledVocabulary
      && this.configData.selectableMetadata[0].controlledVocabulary.length > 0) {
      this.setVocabularyOptions(tagModelConfig);
    }

    this.setValues(tagModelConfig, fieldValue, null, true);

    const tagModel = new DynamicTagModel(tagModelConfig);

    return tagModel;
  }

}

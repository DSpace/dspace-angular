import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicTagModel, DynamicTagModelConfig } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';

export class TagFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const tagModelConfig: DynamicTagModelConfig = this.initModel(null, label);
    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0) {
      this.setAuthorityOptions(tagModelConfig, this.parserOptions.authorityUuid);
    }

    this.setValues(tagModelConfig, fieldValue, null, true);

    const tagModel = new DynamicTagModel(tagModelConfig);

    return tagModel;
  }

}

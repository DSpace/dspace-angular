import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import { DynamicTagModel, DynamicTagModelConfig } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';

export class TagFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const tagModelConfig: DynamicTagModelConfig = this.initModel();
    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0) {
      tagModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      tagModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      tagModelConfig.authorityScope = this.authorityUuid;
    }

    tagModelConfig.value = this.getInitGroupValues();
    tagModelConfig.minChars = 3;
    // this.setValues(tagModelConfig, fieldValue); // TODO Use this after changes in fieldValue
    if (tagModelConfig.value && tagModelConfig.value.length > 0 && tagModelConfig.value[0].language) {
      tagModelConfig.language = tagModelConfig.value[0].language;
      // tagModelConfig.value.forEach((item, index) => {
      //   if (!item.display && item.value) {
      //     tagModelConfig.value[index] = Object.assign({}, item, {display: item.value});
      //   }
      // });
    }

    const tagModel = new DynamicTagModel(tagModelConfig);
    tagModel.name = this.fieldId;

    return tagModel;
  }

}

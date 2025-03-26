import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicTagModel, DynamicTagModelConfig } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import {DynamicFormControlLayout} from '@ng-dynamic-forms/core';
import { environment } from '../../../../../environments/environment';

export class TagFieldParser extends FieldParser {
  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    let clsTag: DynamicFormControlLayout;
    clsTag = {
      grid: {
        container: 'mb-3 mt-3',
      }
    };
    const tagModelConfig: DynamicTagModelConfig = this.initModel(null, label);
    if (this.configData.selectableMetadata[0].controlledVocabulary
      && this.configData.selectableMetadata[0].controlledVocabulary.length > 0) {
      this.setVocabularyOptions(tagModelConfig, this.parserOptions.collectionUUID);
    }
    tagModelConfig.minChars = environment.submission.minChars;
    this.setValues(tagModelConfig, fieldValue, null, true);
    tagModelConfig.placeholder = 'Enter the Keywords';
    const tagModel = new DynamicTagModel(tagModelConfig, clsTag);
    return tagModel;
  }

}

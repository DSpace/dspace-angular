import { FormFieldMetadataValueObject } from '@dspace/core';

import {
  DynamicLookupModel,
  DynamicLookupModelConfig,
} from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';
import { FieldParser } from './field-parser';

export class LookupFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    if (this.configData.selectableMetadata[0].controlledVocabulary) {
      const lookupModelConfig: DynamicLookupModelConfig = this.initModel(null, label);

      this.setVocabularyOptions(lookupModelConfig);

      this.setValues(lookupModelConfig, fieldValue, true);

      return new DynamicLookupModel(lookupModelConfig);

    }
  }
}

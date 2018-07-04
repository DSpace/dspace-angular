import { FieldParser } from './field-parser';
import { DynamicLookupModel, DynamicLookupModelConfig } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';

export class LookupFieldParser extends FieldParser {

  public modelFactory(fieldValue: any): any {
    if (this.configData.selectableMetadata[0].authority) {
      const lookupModelConfig: DynamicLookupModelConfig = this.initModel();

      this.setAuthorityOptions(lookupModelConfig, this.parserOptions.authorityUuid);

      this.setValues(lookupModelConfig, fieldValue, true);

      return new DynamicLookupModel(lookupModelConfig);

    }
  }
}

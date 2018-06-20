import { FormFieldModel } from '../models/form-field.model';
import { FieldParser } from './field-parser';
import {
  DynamicLookupNameModel,
  DynamicLookupNameModelConfig
} from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup-name.model';

export class LookupNameFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected readOnly: boolean,
              protected authorityUuid: string) {
    super(configData, initFormValues, readOnly);
  }

  public modelFactory(fieldValue: any): any {
    if (this.configData.selectableMetadata[0].authority) {
      const lookupModelConfig: DynamicLookupNameModelConfig = this.initModel();

      this.setAuthorityOptions(lookupModelConfig, this.authorityUuid);

      this.setValues(lookupModelConfig, fieldValue, true);

      return new DynamicLookupNameModel(lookupModelConfig);
    }
  }

}

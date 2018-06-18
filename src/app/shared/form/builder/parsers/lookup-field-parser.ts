import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { DynamicLookupModel, DynamicLookupModelConfig } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';

export class LookupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected readOnly: boolean,
              protected authorityUuid: string) {
    super(configData, initFormValues, readOnly);
  }

  public modelFactory(fieldValue: any): any {
    if (this.configData.selectableMetadata[0].authority) {
      const lookupModelConfig: DynamicLookupModelConfig = this.initModel();

      this.setAuthorityOptions(lookupModelConfig, this.authorityUuid);

      this.setValues(lookupModelConfig, fieldValue, true);

      const lookupModel = new DynamicLookupModel(lookupModelConfig);
      return lookupModel;
    }
  }
}

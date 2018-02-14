import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';
import { isNotEmpty } from '../../../empty.util';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicLookupModel, DynamicLookupModelConfig } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';

export class LookupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: any): any {
    if (this.configData.selectableMetadata[0].authority) {
      const lookupModelConfig: DynamicLookupModelConfig = this.initModel();
      lookupModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      lookupModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      lookupModelConfig.authorityScope = this.authorityUuid;
      lookupModelConfig.maxOptions = 10;

      this.setValues(lookupModelConfig, fieldValue, true);
      // if (isNotEmpty(this.getInitFieldValue(0, 0))) {
      //   fieldValue = fieldValue ? fieldValue : this.getInitFieldValue(0, 0);
      //   // If value isn't an instance of AuthorityModel instantiate it
      //   if (fieldValue instanceof AuthorityModel) {
      //     lookupModelConfig.value = fieldValue;
      //   } else {
      //     const authorityValue: AuthorityModel = new AuthorityModel();
      //     authorityValue.value = fieldValue;
      //     authorityValue.display = fieldValue;
      //     lookupModelConfig.value = authorityValue;
      //   }
      // }
      const lookupModel = new DynamicLookupModel(lookupModelConfig);
      return lookupModel;
    }
  }
}

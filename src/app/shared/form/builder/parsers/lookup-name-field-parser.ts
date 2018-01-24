import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { LookupFieldParser } from './lookup-field-parser';

export class LookupNameFieldParser extends LookupFieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected authorityUuid: string) {
    super(configData, initFormValues, authorityUuid);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject | any): any {
    const lookupModel = super.modelFactory(fieldValue);
    lookupModel.separator = ',';
    lookupModel.placeholder = 'First name';
    lookupModel.placeholder2 = 'Last name';
    return lookupModel;

  }
}

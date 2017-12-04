import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';

// @TODO to be implemented
export class LookupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected authorityOptions: IntegrationSearchOptions) {
    super(configData, initFormValues);
  }

  public modelFactory(): any {
    return null;
  }
}

import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';

// @TODO to be implemented
export class LookupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected authorityOptions: AuthorityOptions) {
    super(configData);
  }

  public modelFactory(): any {
    return null;
  }
}

import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';

// @TODO to be implemented
export class TwoboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel) {
    super(configData);
  }

  public modelFactory(): any {
    return null;
  }
}
